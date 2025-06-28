// components/ProductCard.tsx

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types'; // Projemizin ortak Product tipini kullanıyoruz

// Artık component'imiz tek bir "product" nesnesi alıyor.
// Bu, kodu daha temiz ve yönetilebilir yapar.
interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Gelen ürün nesnesinden ihtiyacımız olan bilgileri alıyoruz.
  const { id, imageUrl, category, name, price } = product;

  return (
    <Link href={`/products/${id}`} className="group block">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Ürün Resmi Alanı */}
        <div className="relative aspect-square w-full">
          <Image
            src={imageUrl}
            alt={name}
            fill
            style={{ objectFit: 'cover' }}
            className="group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        
        {/* Ürün Bilgileri Alanı */}
        <div className="p-4">
          <p className="text-sm text-gray-500 mb-1">{category}</p>
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {name}
          </h3>
          <p className="text-xl font-bold text-gray-900 mt-2">
            {price} TL
          </p>
        </div>
      </div>
    </Link>
  );
}