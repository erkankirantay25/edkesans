// app/page.tsx
'use client'; // Bu satır önemli, sayfanın interaktif olmasını sağlar.

export default function HomePage() {
  // Sayfanın JavaScript mantığı buraya gelecek.
  const handleButtonClick = () => {
    alert('Anasayfa butonu çalışıyor!');
  };

  // Sayfanın HTML (JSX) yapısı
  return (
    <div>
      <h1>Merhaba, bu anasayfa.</h1>
      <p>Bu, Tarotouch düzenine benzer basit bir yapı.</p>
      <button 
        onClick={handleButtonClick} 
        style={{ padding: '10px', marginTop: '20px' }}
      >
        Test Butonu
      </button>
    </div>
  );
}
