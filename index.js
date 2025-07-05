// Gerekli paketleri yükleyin: npm install firebase-functions firebase-admin iyzico
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Iyziopay = require("iyzico");

admin.initializeApp();
const db = admin.firestore();

// Iyzico API anahtarlarınızı Firebase environment config'e ekleyin.
// firebase functions:config:set iyzico.key="API_KEY" iyzico.secret="SECRET_KEY"
const iyzico = new Iyziopay({
    apiKey: functions.config().iyzico.key,
    secretKey: functions.config().iyzico.secret,
    uri: "https://sandbox-api.iyzipay.com", // Test için sandbox URI
});

exports.createIyzicoPayment = functions.region('europe-west1').https.onCall(async (data, context) => {
    // Kullanıcı girişi kontrolü
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Bu işlemi yapmak için giriş yapmalısınız.');
    }

    const { paymentCard, basketItems, buyer, shippingAddress, billingAddress, price, paidPrice } = data;
    const userId = context.auth.uid;
    const conversationId = `conv-${userId}-${Date.now()}`; // Benzersiz konuşma ID'si

    const request = {
        locale: Iyziopay.LOCALE.TR,
        conversationId: conversationId,
        price: price.toFixed(2), // Sepet ara toplamı
        paidPrice: paidPrice.toFixed(2), // Kargo dahil ödenecek toplam tutar
        currency: Iyziopay.CURRENCY.TRY,
        installments: '1',
        basketId: `basket-${userId}-${Date.now()}`,
        paymentChannel: Iyziopay.PAYMENT_CHANNEL.WEB,
        paymentGroup: Iyziopay.PAYMENT_GROUP.PRODUCT,
        paymentCard: paymentCard,
        buyer: buyer,
        shippingAddress: shippingAddress,
        billingAddress: billingAddress,
        basketItems: basketItems,
    };

    try {
        const result = await new Promise((resolve, reject) => {
            iyzico.payment.create(request, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        if (result.status === 'success') {
            return { status: 'success', paymentId: result.paymentId, conversationId: conversationId };
        } else {
            throw new functions.https.HttpsError('aborted', result.errorMessage || 'Ödeme sırasında bir hata oluştu.');
        }
    } catch (error) {
        console.error("Iyzico Payment Error:", error);
        throw new functions.https.HttpsError('internal', error.message || 'Ödeme sunucusunda bir hata oluştu.');
    }
});
