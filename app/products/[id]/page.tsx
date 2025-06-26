// app/products/[id]/page.tsx

import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/firebase";

// Veri çekme fonksiyonu
async function getProductById(id: string) { // <-- Tip kaldırdım
  const productRef = doc(db, "products", id);
  const docSnap = await getDoc(productRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
}

// Ana sayfa component'i
export default async function ProductDetailPage({ params }: any) { // <-- Tipi 'any' yaptım
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="w-full h-96 relative rounded-lg overflow-hidden">
          <Image
            src={product.imageUrl || '/placeholder.png'}
            alt={product.name}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
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