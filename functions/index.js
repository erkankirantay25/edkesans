const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Iyzipay = require("iyzipay"); // Değişiklik burada

admin.initializeApp();

const iyzicoClient = new Iyzipay({ // Değişiklik burada
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
        locale: Iyzipay.LOCALE.TR, // Değişiklik burada
        conversationId: conversationId,
        price: parseFloat(price).toFixed(2),
        paidPrice: parseFloat(paidPrice).toFixed(2),
        currency: Iyzipay.CURRENCY.TRY, // Değişiklik burada
        installments: '1',
        basketId: `basket-${userId}-${Date.now()}`,
        paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB, // Değişiklik burada
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT, // Değişiklik burada
        paymentCard: paymentCard,
        buyer: buyer,
        shippingAddress: shippingAddress,
        billingAddress: billingAddress,
        basketItems: basketItems,
    };

    try {
        const result = await new Promise((resolve, reject) => {
            iyzicoClient.payment.create(request, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        if (result.status === 'success') {
            return result;
        } else {
            throw new functions.https.HttpsError('aborted', result.errorMessage || 'Ödeme sırasında bir hata oluştu.');
        }
    } catch (error) {
        console.error("Iyzico Payment Error:", error);
        const errorMessage = error.message || 'Ödeme sunucusunda bir hata oluştu.';
        throw new functions.https.HttpsError('internal', errorMessage);
    }
});
