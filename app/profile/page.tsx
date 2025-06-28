// app/profile/page.tsx

'use client'; // Bu sayfa kullanıcıya özel olduğu için tarayıcıda çalışmalı

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Demand, Product, UserProfile } from '@/types';

// Talep ve ürün bilgilerini birleştirecek yeni bir tip oluşturalım
interface EnrichedDemand extends Demand {
  productDetails?: Product;
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [demands, setDemands] = useState<EnrichedDemand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kullanıcı giriş yapmamışsa veya yükleniyorsa, bir şey yapma veya anasayfaya yönlendir
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    
    // Kullanıcı bilgileri geldiyse, verileri çek
    if (user) {
      const fetchData = async () => {
        setLoading(true);
        
        // 1. Kullanıcının profil bilgilerini çek (userCode için)
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserProfile(userDocSnap.data() as UserProfile);
        }

        // 2. Kullanıcının tüm taleplerini çek
        const demandsRef = collection(db, 'demands');
        const q = query(demandsRef, where('userId', '==', user.uid));
        const demandsSnapshot = await getDocs(q);
        const userDemands = demandsSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Demand));

        // 3. Her talep için ürünün güncel bilgisini çek ve birleştir
        const enrichedDemands: EnrichedDemand[] = await Promise.all(
          userDemands.map(async (demand) => {
            const productDocRef = doc(db, 'products', demand.productId);
            const productDocSnap = await getDoc(productDocRef);
            if (productDocSnap.exists()) {
              return { ...demand, productDetails: productDocSnap.data() as Product };
            }
            return demand; // Ürün bulunamazsa bile talebi göster
          })
        );
        
        setDemands(enrichedDemands);
        setLoading(false);
      };

      fetchData();
    }
  }, [user, authLoading, router]);

  // Yüklenme ekranı
  if (loading || authLoading) {
    return <div className="text-center p-10">Profil bilgileri yükleniyor...</div>;
  }
  
  // Kullanıcı yoksa veya profil bulunamadıysa gösterilecek mesaj
  if (!user || !userProfile) {
    return <div className="text-center p-10">Profil bilgileri bulunamadı. Lütfen tekrar giriş yapın.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{userProfile.name}</h1>
        <p className="text-gray-600">{userProfile.email}</p>
        <p className="mt-2 text-sm font-semibold text-indigo-600">Kullanıcı Kodunuz: {userProfile.userCode}</p>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-gray-800">Taleplerim</h2>
      <div className="space-y-4">
        {demands.length > 0 ? (
          demands.map(demand => (
            <div key={demand.id} className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="font-bold text-lg">{demand.productName}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                <div>
                  <p className="font-semibold text-gray-500">Talep Miktarınız</p>
                  <p className="text-gray-800">{demand.quantity} gr</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-500">Sıranız</p>
                  <p className="text-gray-800">{demand.orderInQueue}. kişi</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-500">Ürünün Toplam Talebi</p>
                  <p className={`font-bold ${
                    (demand.productDetails?.totalDemand || 0) >= 250 
                    ? 'text-green-600' : 'text-orange-500'
                  }`}>
                    {demand.productDetails?.totalDemand || 0} gr
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-500">Durum</p>
                  <p className={`font-bold ${
                    demand.orderInQueue <= (250 / 50) // Herkes 50gr girerse ilk 5 kişi garanti
                    ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {demand.orderInQueue <= (250 / 50) ? 'Garanti Kotada' : 'Garanti Değil'}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Henüz bir talep girmemişsiniz.</p>
        )}
      </div>
    </div>
  );
}