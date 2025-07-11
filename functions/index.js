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

// onCall yerine onRequest kullanıyoruz, çünkü bu bize gelen ham isteği inceleme imkanı verir.
exports.createIyzicoPayment = functions.region('europe-west1').https.onRequest(async (req, res) => {
    // CORS ayarları (farklı domainlerden gelen isteklere izin vermek için)
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    // ADIM 1: Gelen veriyi geldiği gibi logla. Sorunun kaynağını bu gösterecek.
    functions.logger.info("Raw request body received:", req.body);

    // Verinin 'data' objesi içinde geldiğini varsayıyoruz (onCall standardı)
    const data = req.body.data;
    if (!data) {
        functions.logger.error("Request body is missing 'data' wrapper.");
        res.status(400).send({ error: { message: "Bad Request: 'data' wrapper is missing." } });
        return;
    }
    
    // Gelen token'ı doğrula
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
        res.status(401).send({ error: { message: 'Unauthorized: No token provided.'} });
        return;
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const userId = decodedToken.uid;
        const userIp = req.ip;

        const { basketItems, paymentCard, shippingCarrierName } = data;
        
        // --- Buradan sonrası önceki kodla aynı, sadece hata yönetimi res.status() ile yapılıyor ---

        if (!shippingCarrierName) {
            throw { code: 400, message: 'Lütfen bir kargo firması seçin.' };
        }
        
        const userDocPromise = db.collection('users').doc(userId).get();
        const shippingOptionsPromise = db.collection('settings').doc('shippingOptions').get();
        const [userDoc, shippingOptionsDoc] = await Promise.all([userDocPromise, shippingOptionsPromise]);

        if (!userDoc.exists) throw { code: 404, message: 'Kullanıcı veritabanında bulunamadı.' };
        const userData = userDoc.data();

        if (!shippingOptionsDoc.exists) throw { code: 500, message: 'Sistemde kargo ayarları yapılandırılmamış.' };
        const allCarriers = shippingOptionsDoc.data().carriers || [];
        const selectedCarrier = allCarriers.find(c => c.name === shippingCarrierName && c.active);

        if (!selectedCarrier) throw { code: 404, message: 'Seçtiğiniz kargo firması şu anda geçerli değil.' };
        const shippingPrice = parseFloat(selectedCarrier.price);

        const productPromises = basketItems.map(item => db.collection('products').doc(item.productId).get());
        const productSnapshots = await Promise.all(productPromises);
        
        let subtotal = 0;
        const finalBasketItems = productSnapshots.map((doc, index) => {
          if (!doc.exists) throw { code: 404, message: `Sepetinizdeki bir ürün artık mevcut değil.` };
          const productData = doc.data();
          const itemQuantity = basketItems[index].quantity;
          const gramaj = basketItems[index].gram;
          const calculatedPrice = (parseFloat(productData.unitPrice) / 50) * gramaj;
          subtotal += calculatedPrice * itemQuantity;
          return { id: doc.id, name: `${productData.name} (${gramaj}gr)`, category1: productData.category || 'Esans', price: (calculatedPrice * itemQuantity).toFixed(2), itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL, };
        });

        const paidPrice = subtotal + shippingPrice;

        const request = { locale: Iyzipay.LOCALE.TR, conversationId: `conv-${userId}-${Date.now()}`, price: subtotal.toFixed(2), paidPrice: paidPrice.toFixed(2), currency: Iyzipay.CURRENCY.TRY, installment: '1', basketId: `basket-${userId}-${Date.now()}`, paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB, paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT, paymentCard, buyer: { id: userId, name: userData.name.split(' ')[0], surname: userData.name.split(' ').slice(1).join(' ') || 'N/A', gsmNumber: userData.phone || '+905555555555', email: userData.email, identityNumber: '11111111111', lastLoginDate: new Date(decodedToken.auth_time * 1000).toISOString().slice(0, 19).replace('T', ' '), registrationDate: new Date(userData.createdAt?.toDate() || Date.now()).toISOString().slice(0, 19).replace('T', ' '), registrationAddress: userData.address, ip: userIp, city: 'Istanbul', country: 'Turkey', zipCode: '34732', }, shippingAddress: { contactName: userData.name, city: 'Istanbul', country: 'Turkey', address: userData.address, zipCode: '34732' }, billingAddress: { contactName: userData.name, city: 'Istanbul', country: 'Turkey', address: userData.address, zipCode: '34732' }, basketItems: finalBasketItems, };

        const result = await new Promise((resolve, reject) => iyzico.payment.create(request, (err, res) => err ? reject(err) : resolve(res)));

        if (result.status === 'success') {
            res.status(200).send({ data: result });
        } else {
            throw { code: 400, message: result.errorMessage || 'Ödeme sağlayıcısı tarafından reddedildi.' };
        }

    } catch (error) {
        functions.logger.error("Error in createIyzicoPayment function:", error);
        res.status(error.code || 500).send({ error: { message: error.message || 'Ödeme sunucusunda beklenmedik bir hata oluştu.' } });
    }
});
