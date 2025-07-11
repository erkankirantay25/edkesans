const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Iyzipay = require("iyzipay");

try {
  admin.initializeApp();
} catch (e) {
  // Initialization error caught
}
const db = admin.firestore();

const iyzico = new Iyzipay({
    apiKey: "sandbox-E4bEfyI3DGGIv4xzvXfxOep8eI1wSAS6",
    secretKey: "sandbox-gf39QdF4tVtFM0oRaPhY1e3D6zyCUNPy",
    uri: "https://sandbox-api.iyzipay.com",
});

exports.createIyzicoPayment = functions.region('europe-west1').https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Bu işlemi yapmak için giriş yapmalısınız.');
  }

  const userId = context.auth.uid;
  const userIp = context.rawRequest.ip;
  const { basketItems, paymentCard, shippingCarrierName } = data;

  if (!shippingCarrierName) {
      throw new functions.https.HttpsError('invalid-argument', 'Kargo seçimi yapılmamış.');
  }

  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Kullanıcı bulunamadı.');
    }
    const userData = userDoc.data();

    const shippingOptionsDoc = await db.collection('settings').doc('shippingOptions').get();
    if (!shippingOptionsDoc.exists) {
        throw new functions.https.HttpsError('internal', 'Kargo seçenekleri bulunamadı.');
    }
    const allCarriers = shippingOptionsDoc.data().carriers || [];
    const selectedCarrier = allCarriers.find(c => c.name === shippingCarrierName && c.active);

    if (!selectedCarrier) {
        throw new functions.https.HttpsError('not-found', 'Seçilen kargo firması geçerli değil.');
    }
    const shippingPrice = parseFloat(selectedCarrier.price);

    const productPromises = basketItems.map(item => db.collection('products').doc(item.productId).get());
    const productSnapshots = await Promise.all(productPromises);
    
    let subtotal = 0;
    const finalBasketItems = productSnapshots.map((doc, index) => {
      if (!doc.exists) {
        throw new functions.https.HttpsError('not-found', `Sepetteki bir ürün (ID: ${basketItems[index].productId}) veritabanında bulunamadı.`);
      }
      const productData = doc.data();
      const itemQuantity = basketItems[index].quantity;
      const itemPrice = parseFloat(productData.price);
      subtotal += itemPrice * itemQuantity;
      return {
        id: doc.id,
        name: productData.name,
        category1: productData.category || 'Esans',
        price: (itemPrice * itemQuantity).toFixed(2),
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
      };
    });

    const paidPrice = subtotal + shippingPrice;

    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: `conv-${userId}-${Date.now()}`,
      price: subtotal.toFixed(2),
      paidPrice: paidPrice.toFixed(2),
      currency: Iyzipay.CURRENCY.TRY,
      installment: '1',
      basketId: `basket-${userId}-${Date.now()}`,
      paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      paymentCard,
      buyer: {
        id: userId, name: userData.name.split(' ')[0], surname: userData.name.split(' ').slice(1).join(' ') || 'N/A', gsmNumber: userData.phone || '+905555555555', email: userData.email, identityNumber: '11111111111',
        lastLoginDate: new Date(context.auth.token.auth_time * 1000).toISOString().slice(0, 19).replace('T', ' '),
        registrationDate: new Date(userData.createdAt?.toDate() || Date.now()).toISOString().slice(0, 19).replace('T', ' '),
        registrationAddress: userData.address, ip: userIp, city: 'Istanbul', country: 'Turkey', zipCode: '34732',
      },
      shippingAddress: { contactName: userData.name, city: 'Istanbul', country: 'Turkey', address: userData.address, zipCode: '34732' },
      billingAddress: { contactName: userData.name, city: 'Istanbul', country: 'Turkey', address: userData.address, zipCode: '34732' },
      basketItems: finalBasketItems,
    };

    const result = await new Promise((resolve, reject) => {
      iyzico.payment.create(request, (err, res) => err ? reject(err) : resolve(res));
    });

    if (result.status === 'success') {
      return result;
    } else {
      throw new functions.https.HttpsError('aborted', result.errorMessage || 'Ödeme sağlayıcısı tarafından reddedildi.');
    }

  } catch (error) {
    functions.logger.error("Error in createIyzicoPayment function:", error);
    if (error instanceof functions.https.HttpsError) throw error;
    throw new functions.https.HttpsError('internal', error.message || 'Ödeme sunucusunda beklenmedik bir hata oluştu.');
  }
});
