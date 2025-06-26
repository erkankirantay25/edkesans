// app/products/[id]/page.tsx

// Bu, sahte ürün verilerimizi tekrar kullanmak için import ediyoruz
import { sampleProducts } from '../../../data/products';
// Not: Bu import yolunu birazdan düzelteceğiz!

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  // URL'den gelen ürün ID'sini alıyoruz. params.id bize bunu verir.
  const productId = parseInt(params.id, 10);

  // Sahte ürün listemizde bu ID'ye sahip ürünü buluyoruz.
  const product = sampleProducts.find(p => p.id === productId);

  // Eğer ürün bulunamazsa bir hata mesajı gösterelim.
  if (!product) {
    return <div>Ürün bulunamadı!</div>;
  }

  // Ürün bulunduysa, bilgilerini ekrana basalım.
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold">{product.name}</h1>
      <p className="text-xl text-gray-600">{product.category}</p>
      <div className="mt-4">
        {/* Buraya daha sonra ürün resmi ve detaylı açıklama gelecek */}
        <p className="text-2xl font-bold">{product.price} TL</p>
      </div>
    </div>
  );
}