// components/DemandForm.tsx

'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth'; // Henüz olmayan bir hook, sonraki pakette yapacağız!

export default function DemandForm({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(50);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth(); // Kullanıcı bilgilerini almak için

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Talep girmek için giriş yapmalısınız.');
      return;
    }
    
    // ŞİMDİLİK BU KISIM BOŞ, API VE CLOUD FUNCTION'LARI YAPINCA DOLDURACAĞIZ
    setError('');
    setSuccess(`Başarıyla ${quantity}gr talep girdiniz! API entegrasyonu bekleniyor.`);
    console.log({
      productId: product.id,
      quantity,
      userId: user.uid,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-gray-50">
      <p className="text-sm text-gray-600 mb-4">
        Talep miktarları 50gr ve katları olarak girilmelidir.
      </p>
      <div className="flex items-center gap-4">
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          step="50"
          min="50"
          className="w-24 px-3 py-2 border rounded-md"
        />
        <span className="text-gray-700">gram</span>
        <button type="submit" className="px-6 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700">
          Talep Gönder
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      {success && <p className="mt-2 text-sm text-green-500">{success}</p>}
    </form>
  );
}