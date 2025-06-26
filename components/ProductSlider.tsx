// components/ProductSlider.tsx
'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import ProductCard from './ProductCard';
import Link from 'next/link';

// Swiper'ın CSS dosyalarını import ediyoruz
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Ürün tipini tanımlıyoruz (daha önce ProductCard'da da yapmıştık)
type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
};

// Bileşenimizin alacağı props'ları tanımlıyoruz
type ProductSliderProps = {
  title: string;
  products: Product[];
  seeAllLink: string;
};

export default function ProductSlider({ title, products, seeAllLink }: ProductSliderProps) {
  return (
    <section className="py-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">{title}</h2>
          <Link href={seeAllLink} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Tümünü Gör →
          </Link>
        </div>

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1.5}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            // Ekran boyutu 640px'den büyükse
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            // Ekran boyutu 768px'den büyükse
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            // Ekran boyutu 1024px'den büyükse
            1024: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
          }}
          className="!pb-10" // Pagination noktaları için altta boşluk bırakıyoruz
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard
                id={product.id}
                name={product.name}
                category={product.category}
                price={product.price}
                imageUrl={product.imageUrl}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}