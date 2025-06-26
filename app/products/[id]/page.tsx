// app/products/[id]/page.tsx

import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { notFound } from "next/navigation"; // notFound fonksiyonunu import et
import { db } from "@/lib/firebase";
import { Product } from "@/types";

// Sayfa component'i props'larının tipini doğrudan burada tanımlayalım
// Bu, Next.js'in beklediği en temel yapıdır.
type Props = {
  params: {
    id: string;
  };
};

// Veri çekme fonksiyonu - Değişiklik yok
async function getProductById(id: string): Promise<Product | null> {
  try {
    const productRef = doc(db, "products", id);
    const docSnap = await getDoc(productRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    return null;
  }
}

// SEO ve sayfa başlığı için metadata fonksiyonu (Önerilen)
export async function generateMetadata({ params }: Props) {
  const product = await getProductById(params.id);
  if (!product) {
    return {
      title: 'Ürün Bulunamadı'
    }
  }
  return {
    title: `${product.name} | Esanscim`,
    description: product.description
  }
}

// Component'i async yaparak sunucu tarafında veri çekmesini sağlıyoruz
export default async function ProductDetailPage({ params }: Props) {
  const product = await getProductById(params.id);

  // Ürün bulunamazsa, Next.js'in kendi 404 sayfasını gösterelim
  if (!product) {
    notFound();
  }

  // Ürün bulunduysa, detaylarını gösterelim
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ürün Resmi */}
        <div className="w-full h-96 relative rounded-lg overflow-hidden">
          <Image
            src={product.imageUrl || '/placeholder.png'}
            alt={product.name}
            fill // layout="fill" yerine fill kullanın
            style={{objectFit:"cover"}} // objectFit="cover" yerine bu şekilde kullanın
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