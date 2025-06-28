// app/products/page.tsx

// Bu sayfa sunucuda çalışacak ve verileri önceden çekecek.
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/types";
import ProductList from "@/components/ProductList"; // Bu component'i güncelleyeceğiz

async function getAllProducts(): Promise<Product[]> {
  const productsCol = collection(db, "products");
  const productSnapshot = await getDocs(productsCol);
  const productList = productSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Product[];
  return productList;
}

export default async function AllProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Tüm Ürünler</h1>
      {/* 
        ProductList component'ine ürünleri prop olarak geçireceğiz.
        Sıralama mantığı bu component'in içinde olacak.
      */}
      <ProductList initialProducts={products} />
    </div>
  );
}