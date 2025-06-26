// data/products.ts
export const sampleProducts = [
  // ... mevcut 4 ürün ...
  { id: 1, name: 'Obsession Night', category: 'Erkek', price: 1250, imageUrl: '/urun-1.jpg' },
  { id: 2, name: 'Chanel No. 5', category: 'Kadın', price: 1980, imageUrl: '/urun-2.jpg' },
  { id: 3, name: 'Velvet Orchid', category: 'Kadın', price: 1500, imageUrl: '/urun-3.jpg' },
  { id: 4, name: 'Citrus Breeze', category: 'Unisex', price: 750, imageUrl: '/urun-4.jpg' },
  // YENİ ÜRÜNLER
  { id: 5, name: 'Savage Elixir', category: 'Erkek', price: 1800, imageUrl: 'https://images.unsplash.com/photo-1617195921828-81c787a71129?q=80&w=1887&auto=format&fit=crop' },
  { id: 6, name: 'Black Opium', category: 'Kadın', price: 1650, imageUrl: 'https://images.unsplash.com/photo-1598556146864-586616885c94?q=80&w=1887&auto=format&fit=crop' },
  { id: 7, name: 'Explorer Ultra Blue', category: 'Erkek', price: 1100, imageUrl: 'https://images.unsplash.com/photo-1620005758223-23a54a727233?q=80&w=1887&auto=format&fit=crop' },
  { id: 8, name: 'La Vie Est Belle', category: 'Kadın', price: 1720, imageUrl: 'https://images.unsplash.com/photo-1613521140683-1345970a36dd?q=80&w=1887&auto=format&fit=crop' },
  { id: 9, name: 'CK One', category: 'Unisex', price: 950, imageUrl: 'https://images.unsplash.com/photo-1616013629437-094c3527b878?q=80&w=1887&auto=format&fit=crop' },
];
// NOT: Gerçek projede şişe ve ekipmanlar için ayrı data listeleri olurdu.
export const sampleBottles = sampleProducts.slice(0, 5).map(p => ({...p, category: 'Şişe'}));
export const sampleEquipments = sampleProducts.slice(4, 9).map(p => ({...p, category: 'Ekipman'}));