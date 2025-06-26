// components/ProductCard.tsx
import Image from 'next/image';
import Link from 'next/link';

// Bu, bileşenimizin hangi bilgileri alacağını tanımlar (bir nevi sipariş listesi)
type ProductCardProps = {
  id: number;
  imageUrl: string;
  category: string;
  name: string;
  price: number;
};

export default function ProductCard({ imageUrl, category, name, price, id }: ProductCardProps) {
  return (
    <Link href={`/products/${id}`} className="group block">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Ürün Resmi Alanı */}
        <div className="relative aspect-square w-full">
          <Image
            src={imageUrl}
            alt={name}
            fill // Bu, resmi kapsayıcısını dolduracak şekilde ayarlar
            style={{ objectFit: 'cover' }} // Resmin orantısını bozmadan doldurmasını sağlar
            className="group-hover:scale-105 transition-transform duration-300"
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
          {/* Sepete ekle butonu daha sonra buraya gelebilir */}
        </div>
      </div>
    </Link>
  );
}