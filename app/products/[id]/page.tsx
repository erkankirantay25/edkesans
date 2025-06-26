// app/products/[id]/page.tsx

import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { db } from "../../../lib/firebase"; // Firebase ayar dosyamızın doğru yolu
import { Product } from "../../../types"; // Ortak Product tipimiz

// Veri çekme fonksiyonu
async function getProductById(id: string): Promise<Product | null> {
  try {
    const productRef = doc(db, "products", id); // Firestore'da 'products' koleksiyonu içindeki belirli bir dökümana referans
    const docSnap = await getDoc(productRef);

    if (docSnap.exists()) {
      // Döküman varsa, veriyi Product tipine uygun şekilde döndür
      return { id: docSnap.id, ...docSnap.data() } as Product;
    } else {
      // Döküman bulunamadı
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    return null; // Hata durumunda null döndür
  }
}

// Sayfa component'i props'larının tipini tanımlayalım
type ProductDetailPageProps = {
  params: {
    id: string; // URL'den gelen ID her zaman string'dir
  };
};

// Component'i async yaparak sunucu tarafında veri çekmesini sağlıyoruz
export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = params;
  const product = await getProductById(id);

  // Eğer ürün bulunamazsa veya bir hata oluşursa, kullanıcıya bilgi verelim
  if (!product) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold">Ürün Bulunamadı</h1>
        <p className="mt-2 text-gray-600">Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
      </div>
    );
  }

  // Ürün bulunduysa, detaylarını gösterelim
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ürün Resmi */}
        <div className="w-full h-96 relative rounded-lg overflow-hidden">
          <Image
            src={product.imageUrl || '/placeholder.png'} // imageUrl yoksa varsayılan bir resim göster
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Ürün Bilgileri */}
        <div className="flex flex-col justify-center">
          <span className="text-sm font-semibold text-indigo-600 uppercase">{product.category}</span>
          <h1 className="text-3xl md:text-4xl font-bold my-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="flex items-center justify-between mt-4">
            <p className="text-3xl font-bold text-gray-800">{product.price} TL</p>
            <button className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors">
              Sepete Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
