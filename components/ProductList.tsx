// components/ProductList.tsx

'use client'; // Bu component artık interaktif olacak.

import { useState, useMemo } from 'react';
import { Product } from '@/types';
import ProductCard from './ProductCard'; // Mevcut ProductCard component'inizi kullanıyoruz

type SortOption = 'default' | 'price_asc' | 'price_desc';

interface ProductListProps {
  initialProducts: Product[];
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [sortOption, setSortOption] = useState<SortOption>('default');

  // Sıralama seçeneği değiştiğinde ürünleri yeniden sırala
  // useMemo, her render'da gereksiz yere sıralama yapılmasını önler, performansı artırır.
  const sortedProducts = useMemo(() => {
    const sortableProducts = [...products]; // Orijinal diziyi bozmamak için kopyasını oluştur
    switch (sortOption) {
      case 'price_asc':
        return sortableProducts.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return sortableProducts.sort((a, b) => b.price - a.price);
      case 'default':
      default:
        return initialProducts; // Varsayılan sıralamaya dön
    }
  }, [sortOption, products, initialProducts]);

  return (
    <div>
      {/* SIRALAMA KONTROL MENÜSÜ */}
      <div className="mb-6 flex justify-end">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as SortOption)}
          className="px-4 py-2 border rounded-md bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="default">Varsayılan Sıralama</option>
          <option value="price_asc">Fiyata Göre (Artan)</option>
          <option value="price_desc">Fiyata Göre (Azalan)</option>
        </select>
      </div>

      {/* ÜRÜN KARTLARI LİSTESİ */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Gösterilecek ürün bulunamadı.</p>
      )}
    </div>
  );
}