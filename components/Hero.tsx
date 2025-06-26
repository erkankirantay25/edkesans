// components/Hero.tsx
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative bg-gray-900 text-white rounded-lg overflow-hidden">
      {/* Arka Plan Resmi */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/parfum-banner.png')" }}
      ></div>

      {/* İçerik */}
      <div className="relative z-10 container mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
          Tarzınızı Yansıtan Kokular
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          En yeni koleksiyonları keşfedin ve stilinize değer katın.
        </p>
        <Link 
          href="/products" 
          className="bg-white text-gray-900 font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition duration-300"
        >
          Şimdi Alışverişe Başla
        </Link>
      </div>
    </section>
  );
}