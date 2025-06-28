// components/DemandForm.tsx

'use client';

import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useAuth } from '@/hooks/useAuth'; // Az önce oluşturduğumuz hook'u import ediyoruz
import { Product } from '@/types';

// Firebase Functions servisini başlat
const functions = getFunctions();
const createDemand = httpsCallable(functions, 'createDemand'); // Backend'deki fonksiyonumuza referans

export default function DemandForm({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(50);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading: authLoading } = useAuth(); // Kullanıcı bilgilerini ve yüklenme durumunu al

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (authLoading) return; // Kullanıcı bilgisi yüklenirken bir şey yapma

    if (!user) {
      setError('Talep girmek için giriş yapmalısınız.');
      return;
    }

    setIsLoading(true);

    try {
      // Backend'deki 'createDemand' fonksiyonumuzu çağırıyoruz!
      // Gerekli verileri (productId, quantity) gönderiyoruz.
      const result: any = await createDemand({
        productId: product.id,
        quantity: quantity,
      });

      if (result.data.success) {
        setSuccess(`Talep başarıyla oluşturuldu! Sıranız: ${result.data.orderInQueue}`);
        // Formu temizle veya başka bir işlem yap
        // Sayfayı yenilemek yerine, talepler listesini state yönetimiyle güncelleyebiliriz (ileri seviye)
        window.location.reload(); // Şimdilik en basit çözüm: Sayfayı yenile
      } else {
        setError(result.data.message || 'Bilinmeyen bir hata oluştu.');
      }
    } catch (err: any) {
      console.error('Fonksiyon çağrılırken hata:', err);
      setError(err.message || 'Talep oluşturulurken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  // Kullanıcı bilgisi yüklenirken formu gösterme
  if (authLoading) {
    return <div className="p-4 text-center">Yükleniyor...</div>;
  }
  
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
          disabled={isLoading}
        />
        <span className="text-gray-700">gram</span>
        <button 
          type="submit" 
          className="px-6 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400"
          disabled={isLoading}
        >
          {isLoading ? 'Gönderiliyor...' : 'Talep Gönder'}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      {success && <p className="mt-2 text-sm text-green-500">{success}</p>}
    </form>
  );
}