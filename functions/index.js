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
      throw new functions.https.HttpsError('invalid-argument', 'Lütfen bir kargo firması seçin.');
  }

  try {
    const userDocPromise = db.collection('users').doc(userId).get();
    const shippingOptionsPromise = db.collection('settings').doc('shippingOptions').get();
    const [userDoc, shippingOptionsDoc] = await Promise.all([userDocPromise, shippingOptionsPromise]);

    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Kullanıcı veritabanında bulunamadı.');
    }
    const userData = userDoc.data();

    if (!shippingOptionsDoc.exists) {
        throw new functions.https.HttpsError('internal', 'Sistemde kargo ayarları yapılandırılmamış.');
    }
    const allCarriers = shippingOptionsDoc.data().carriers || [];
    const selectedCarrier = allCarriers.find(c => c.name === shippingCarrierName && c.active);

    if (!selectedCarrier) {
        throw new functions.https.HttpsError('not-found', 'Seçtiğiniz kargo firması şu anda geçerli değil.');
    }
    const shippingPrice = parseFloat(selectedCarrier.price);

    const productPromises = basketItems.map(item => db.collection('products').doc(item.productId).get());
    const productSnapshots = await Promise.all(productPromises);
    
    let subtotal = 0;
    const finalBasketItems = productSnapshots.map((doc, index) => {
      if (!doc.exists) {
        throw new functions.https.HttpsError('not-found', `Sepetinizdeki bir ürün artık mevcut değil (ID: ${basketItems[index].productId}).`);
      }
      const productData = doc.data();
      const itemQuantity = basketItems[index].quantity;
      const gramaj = basketItems[index].gram;
      
      const calculatedPrice = (parseFloat(productData.unitPrice) / 50) * gramaj;
      
      subtotal += calculatedPrice * itemQuantity;

      return {
        id: doc.id,
        name: `${productData.name} (${gramaj}gr)`,
        category1: productData.category || 'Esans',
        price: (calculatedPrice * itemQuantity).toFixed(2),
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
      // HATA BURADAYDI! Iyzico'dan gelen tüm objeyi değil, sadece
      // gerekli bilgileri içeren sade bir obje geri döndürüyoruz.
      return { 
        status: result.status, 
        paymentId: result.paymentId,
        price: result.price,
      };
    } else {
      throw new functions.https.HttpsError('aborted', result.errorMessage || 'Ödeme sağlayıcısı tarafından reddedildi.');
    }

  } catch (error) {
    functions.logger.error("Error in createIyzicoPayment function:", error);
    if (error instanceof functions.https.HttpsError) throw error;
    throw new functions.https.HttpsError('internal', error.message || 'Ödeme sunucusunda beklenmedik bir hata oluştu.');
  }
});
