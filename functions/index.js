const functions = require("firebase-functions");
const admin = require("firebase-admin");
const iyzico = require("iyzico");
const cors = require("cors");

admin.initializeApp();

// Sadece kendi web sitenizden gelen isteklere izin verin. Bu en güvenli yöntemdir.
const corsHandler = cors({ origin: "https://esanscim.com" });

const iyzicoClient = new iyzico({
    apiKey: "sandbox-E4bEfyI3DGGIv4xzvXfxOep8e1wSA56",
    secretKey: "sandbox-gf39QdF4tVtFM0oRaPHy1e3D6zyCUNPy",
    uri: "https://sandbox-api.iyzipay.com",
});

// Fonksiyonu onCall'dan onRequest'e çevirerek CORS kontrolünü tamamen bize bırakıyoruz.
exports.createIyzicoPayment = functions.region('europe-west1').https.onRequest((req, res) => {
    // CORS handler'ı fonksiyonun başında çalıştırın.
    corsHandler(req, res, async () => {

        // Güvenlik: Sadece POST isteklerini kabul et
        if (req.method !== 'POST') {
            res.status(405).send('Method Not Allowed');
            return;
        }

        const { paymentCard, basketItems, buyer, shippingAddress, billingAddress, price, paidPrice } = req.body;
        
        // Basit bir doğrulama
        if (!paymentCard || !paidPrice) {
            res.status(400).send({ status: 'error', errorMessage: 'Eksik ödeme bilgileri.' });
            return;
        }
        
        const conversationId = `conv-${buyer.id || 'guest'}-${Date.now()}`;

        const request = {
            locale: iyzico.LOCALE.TR,
            conversationId: conversationId,
            price: parseFloat(price).toFixed(2),
            paidPrice: parseFloat(paidPrice).toFixed(2),
            currency: iyzico.CURRENCY.TRY,
            installments: '1',
            basketId: `basket-${buyer.id || 'guest'}-${Date.now()}`,
            paymentChannel: iyzico.PAYMENT_CHANNEL.WEB,
            paymentGroup: iyzico.PAYMENT_GROUP.PRODUCT,
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
                functions.logger.info("Iyzico Payment Success:", { paymentId: result.paymentId });
                res.status(200).send(result);
            } else {
                functions.logger.error("Iyzico Payment Failed:", { errorMessage: result.errorMessage, errorCode: result.errorCode });
                res.status(400).send(result);
            }
        } catch (error) {
            functions.logger.error("Iyzico System Error:", { message: error.message });
            res.status(500).send({ status: 'error', errorMessage: error.message || 'Ödeme sunucusunda bir hata oluştu.' });
        }
    });
});
