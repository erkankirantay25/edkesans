const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Iyzipay = require("iyzipay"); // Paketi bu şekilde çağırıyoruz

admin.initializeApp();

// istemciyi paketten oluşturuyoruz
const iyzico = new Iyzipay({
    apiKey: "sandbox-E4bEfyI3DGGIv4xzvXfxOep8e1wSA56",
    secretKey: "sandbox-gf39QdF4tVtFM0oRaPHy1e3D6zyCUNPy",
    uri: "https://sandbox-api.iyzipay.com",
});

exports.createIyzicoPayment = functions.region('europe-west1').https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Bu işlemi yapmak için giriş yapmalısınız.');
    }

    const { paymentCard, basketItems, buyer, shippingAddress, billingAddress, price, paidPrice } = data;
    const userId = context.auth.uid;
    const conversationId = `conv-${userId}-${Date.now()}`;

    const request = {
        locale: Iyzipay.LOCALE.TR, // Paketin kendisini kullanıyoruz
        conversationId: conversationId,
        price: parseFloat(price).toFixed(2),
        paidPrice: parseFloat(paidPrice).toFixed(2),
        currency: Iyzipay.CURRENCY.TRY, // Paketin kendisini kullanıyoruz
        installments: '1',
        basketId: `basket-${userId}-${Date.now()}`,
        paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB, // Paketin kendisini kullanıyoruz
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT, // Paketin kendisini kullanıyoruz
        paymentCard: paymentCard,
        buyer: buyer,
        shippingAddress: shippingAddress,
        billingAddress: billingAddress,
        basketItems: basketItems,
    };

    return new Promise((resolve, reject) => {
        // istemciyi kullanarak ödeme isteği yapıyoruz
        iyzico.payment.create(request, (err, result) => {
            if (err) {
                console.error("Iyzico API Error:", err);
                reject(new functions.https.HttpsError('internal', err.message || 'Ödeme sağlayıcısında bir hata oluştu.'));
            } else if (result.status === 'success') {
                console.log("Iyzico Payment Success:", result);
                resolve(result);
            } else {
                console.error("Iyzico Payment Failure:", result);
                reject(new functions.https.HttpsError('aborted', result.errorMessage || 'Ödeme başarısız oldu.'));
            }
        });
    });
});
