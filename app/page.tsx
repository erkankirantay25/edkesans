// app/page.tsx
import Hero from "../components/Hero";
import ProductSlider from "../components/ProductSlider";
import { sampleProducts, sampleBottles, sampleEquipments } from "../data/products";

export default function HomePage() {

  // Kategorilere göre ürünleri filtreleyelim
  const featuredProducts = sampleProducts; // Şimdilik hepsi öne çıkan olsun
  const maleProducts = sampleProducts.filter(p => p.category === 'Erkek');
  const femaleProducts = sampleProducts.filter(p => p.category === 'Kadın');
  const unisexProducts = sampleProducts.filter(p => p.category === 'Unisex');

  return (
    <div className="space-y-8">
      <Hero />
      
      <ProductSlider 
        title="Öne Çıkanlar" 
        products={featuredProducts}
        seeAllLink="/products/featured"
      />
      
      <ProductSlider 
        title="Erkek Parfümleri" 
        products={maleProducts}
        seeAllLink="/products/male"
      />

      <ProductSlider 
        title="Kadın Parfümleri" 
        products={femaleProducts}
        seeAllLink="/products/female"
      />

      <ProductSlider 
        title="Unisex Parfümler" 
        products={unisexProducts}
        seeAllLink="/products/unisex"
      />
      
      <ProductSlider 
        title="Şişeler" 
        products={sampleBottles}
        seeAllLink="/bottles"
      />
      
      <ProductSlider 
        title="Ekipmanlar" 
        products={sampleEquipments}
        seeAllLink="/equipments"
      />
    </div>
  );
}