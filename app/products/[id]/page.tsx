// app/products/[id]/page.tsx

// Bu sayfa sunucuda çalışacak, bu yüzden 'use client' yok.
import { doc, getDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/firebase";
import { Product, Demand } from "@/types";
import DemandForm from "@/components/DemandForm"; // Yeni oluşturacağımız component
import DemandList from "@/components/DemandList";   // Yeni oluşturacağımız component

// Veri çekme fonksiyonları
async function getProductById(id: string): Promise<Product | null> {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Product) : null;
}

async function getDemandsForProduct(productId: string): Promise<Demand[]> {
  const demandsRef = collection(db, "demands");
  const q = query(demandsRef, where("productId", "==", productId), orderBy("createdAt", "asc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Demand));
}


type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props) {
  const product = await getProductById(params.id);
  return {
    title: product ? `${product.name} | Esanscim` : 'Ürün Bulunamadı',
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProductById(params.id);
  
  if (!product) {
    notFound();
  }

  // Bu ürüne ait talepleri de çekelim
  const demands = await getDemandsForProduct(params.id);

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* ÜRÜN BİLGİLERİ BÖLÜMÜ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="w-full h-96 relative rounded-lg overflow-hidden">
          <Image
            src={product.imageUrl || '/placeholder.png'}
            alt={product.name}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw"
          />
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-sm font-semibold text-indigo-600 uppercase">{product.category}</span>
          <h1 className="text-3xl md:text-4xl font-bold my-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-3xl font-bold text-gray-800">{product.price} TL / 50gr</p>
          
          {/* TALEP GİRME FORMU BURAYA GELECEK */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Talep Gir</h3>
            <DemandForm product={product} /> 
          </div>
        </div>
      </div>

      {/* TALEPLERİ LİSTELEME BÖLÜMÜ */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Ürün Talepleri ({demands.length} kişi)</h2>
        <DemandList demands={demands} />
      </div>
    </div>
  );
}