const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Iyzipay = require("iyzipay");

try {
    admin.initializeApp();
} catch (e) {
    console.error("Firebase admin initialization error:", e);
}

let iyzico;
try {
    iyzico = new Iyzipay({
        apiKey: "sandbox-E4bEfyI3DGGIv4xzvXfxOep8e1wSA56",
        secretKey: "sandbox-gf39QdF4tVtFM0oRaPHy1e3D6zyCUNPy",
        uri: "https://sandbox-api.iyzipay.com",
    });
} catch (e) {
    console.error("Iyzipay initialization error:", e);
}


exports.createIyzicoPayment = functions.region('europe-west1').https.onCall(async (data, context) => {
    functions.logger.info("Function triggered with data:", data);

    if (!context.auth) {
        functions.logger.error("Authentication check failed.");
        throw new functions.https.HttpsError('unauthenticated', 'Bu işlemi yapmak için giriş yapmalısınız.');
    }

    if (!iyzico) {
        functions.logger.error("Iyzico client is not initialized.");
        throw new functions.https.HttpsError('internal', 'Ödeme sağlayıcısı başlatılamadı.');
    }

    const { paymentCard, basketItems, buyer, shippingAddress, billingAddress, price, paidPrice } = data;
    const userId = context.auth.uid;
    const conversationId = `conv-${userId}-${Date.now()}`;

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
        paymentCard, buyer, shippingAddress, billingAddress, basketItems,
    };

    functions.logger.info("Sending request to Iyzico:", request);

    try {
        const result = await new Promise((resolve, reject) => {
            iyzico.payment.create(request, (err, result) => {
                if (err) {
                    functions.logger.error("Iyzico API Error Response:", err);
                    reject(err);
                } else {
                    functions.logger.info("Iyzico API Success Response:", result);
                    resolve(result);
                }
            });
        });
        
        if (result.status === 'success') {
            return result;
        } else {
            throw new functions.https.HttpsError('aborted', result.errorMessage || 'Ödeme sağlayıcısı tarafından reddedildi.');
        }
    } catch (error) {
        functions.logger.error("General error in function execution:", error);
        throw new functions.https.HttpsError('internal', error.message || 'Ödeme sunucusunda beklenmedik bir hata oluştu.');
    }
});
