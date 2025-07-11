const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Iyzipay = require("iyzipay");

admin.initializeApp();

const iyzico = new Iyzipay({
    apiKey: "sandbox-E4bEfyI3DGGIv4xzvXfxOep8e1wSA56",
    secretKey: "sandbox-gf39QdF4tVtFM0oRaPHy1e3D6zyCUNPy",
    uri: "https://sandbox-api.iyzipay.com",
});

exports.createIyzicoPayment = functions.region('europe-west1').https.onCall(async (data, context) => {
    // 1. Kullanıcı girişi kontrolü
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Bu işlemi yapmak için giriş yapmalısınız.');
    }

    // 2. Gelen verileri ayıklama
    const { paymentCard, basketItems, buyer, shippingAddress, billingAddress, price, paidPrice } = data;
    const userId = context.auth.uid;
    const conversationId = `conv-${userId}-${Date.now()}`;

    // 3. Iyzico'ya gönderilecek isteği hazırlama
    const request = {
        locale: Iyzipay.LOCALE.TR,
        conversationId: conversationId,
        price: parseFloat(price).toFixed(2),
        paidPrice: parseFloat(paidPrice).toFixed(2),
        currency: Iyzipay.CURRENCY.TRY,
        installments: '1',
        basketId: `basket-${userId}-${Date.now()}`,
        paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        paymentCard: paymentCard,
        buyer: buyer,
        shippingAddress: shippingAddress,
        billingAddress: billingAddress,
        basketItems: basketItems,
    };

    // 4. Iyzico'ya isteği gönderme ve sonucu bekleme
    try {
        const result = await new Promise((resolve, reject) => {
            iyzico.payment.create(request, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        
        // 5. Sonucu istemciye geri gönderme
        if (result.status === 'success') {
            return result; // Başarılıysa sonucu direkt döndür
        } else {
            // Başarısızsa, bir hata fırlat
            throw new functions.https.HttpsError('aborted', result.errorMessage || 'Ödeme sağlayıcısı tarafından reddedildi.');
        }
    } catch (error) {
        console.error("Iyzico isteğinde ciddi hata:", error);
        throw new functions.https.HttpsError('internal', error.message || 'Ödeme sunucusunda beklenmedik bir hata oluştu.');
    }
});
