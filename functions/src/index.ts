// functions/src/index.ts

// v2 için gerekli importlar
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

/**
 * v2 Sürümü: Yeni bir kullanıcı 'users' koleksiyonuna eklendiğinde tetiklenir.
 * Bu fonksiyon, kullanıcıya benzersiz bir userCode atar.
 */
export const assignUserCode = onDocumentCreated("users/{userId}", async (event) => {
  const userId = event.params.userId;
  const userRef = db.collection("users").doc(userId);
  const siteSettingsRef = db.collection("siteSettings").doc("config");

  logger.info(`New user created, assigning code to: ${userId}`);

  return db.runTransaction(async (transaction) => {
    const settingsDoc = await transaction.get(siteSettingsRef);
    const lastUserCode = settingsDoc.data()?.lastUserCode || 0;
    const newUserCodeNumber = lastUserCode + 1;
    const userCode = `ED-${newUserCodeNumber}`;

    transaction.update(userRef, { userCode });
    transaction.set(siteSettingsRef, { lastUserCode: newUserCodeNumber }, { merge: true });

    logger.info(`User ${userId} has been assigned code: ${userCode}`);
  });
});


/**
 * v2 Sürümü: HTTP isteği ile çağrılabilen bir fonksiyon.
 * Yeni bir talep oluşturur, sırasını hesaplar ve veritabanına yazar.
 */
export const createDemand = onCall(async (request) => {
  // Kullanıcı giriş yapmış mı diye kontrol et (v2'de bu şekilde)
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "Bu işlemi yapmak için giriş yapmalısınız."
    );
  }

  const { productId, quantity } = request.data;
  const userId = request.auth.uid;

  if (!productId || !quantity || quantity < 50) {
    throw new HttpsError(
      "invalid-argument",
      "Geçersiz ürün ID'si veya miktar."
    );
  }
  
  logger.info(`Demand creation request from ${userId} for product ${productId}`);

  const userRef = db.collection("users").doc(userId);
  const productRef = db.collection("products").doc(productId);
  const demandsRef = db.collection("demands");

  const existingDemandQuery = await demandsRef
    .where("userId", "==", userId)
    .where("productId", "==", productId)
    .limit(1)
    .get();

  if (!existingDemandQuery.empty) {
    throw new HttpsError("already-exists", "Bu ürün için zaten bir talep girdiniz.");
  }

  return db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);
    const productDoc = await transaction.get(productRef);

    if (!userDoc.exists || !productDoc.exists) {
      throw new HttpsError("not-found", "Kullanıcı veya ürün bulunamadı.");
    }

    const productDemandsQuery = demandsRef.where("productId", "==", productId);
    const productDemandsSnapshot = await transaction.get(productDemandsQuery);
    const orderInQueue = productDemandsSnapshot.size + 1;

    const newDemandRef = demandsRef.doc();
    transaction.set(newDemandRef, {
      userId,
      userCode: userDoc.data()?.userCode || "Bilinmiyor",
      productId,
      productName: productDoc.data()?.name || "Bilinmiyor",
      quantity,
      status: "valid",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      orderInQueue,
    });
    
    const currentTotalDemand = productDoc.data()?.totalDemand || 0;
    transaction.update(productRef, { totalDemand: currentTotalDemand + quantity });

    logger.info(`Demand created for ${userId}. Order in queue: ${orderInQueue}`);
    return { success: true, message: "Talep başarıyla oluşturuldu.", orderInQueue };
  });
});