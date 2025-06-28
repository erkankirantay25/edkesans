// app/register/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // <-- YENİ: Yüklenme durumu için state
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    alert("Butona basıldı, fonksiyon çalıştı!");
    e.preventDefault();
    setError(null);
    setIsLoading(true); // <-- YENİ: İşlem başladığında yükleniyor durumunu başlat

    if (!name || !email || !password) {
      setError('Lütfen tüm alanları doldurun.');
      setIsLoading(false); // Hata varsa yüklenmeyi durdur
      return;
    }

    try {
      // 1. Firebase Authentication ile kullanıcıyı oluştur
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Firestore'da kullanıcı için bir profil dökümanı oluştur
      // ÖNEMLİ: Auth profili güncellemesinden ÖNCE Firestore'a yazıyoruz.
      // Çünkü Cloud Function'ımız bu dökümanın oluşturulmasını dinliyor.
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        name: name,
        email: user.email,
        createdAt: serverTimestamp(),
        role: 'user',
        isBanned: false,
        isActive: true,
      });
      
      console.log('Firestore dökümanı başarıyla oluşturuldu.');

      // 3. Kullanıcının Authentication profilindeki görünen ismini güncelle
      await updateProfile(user, { displayName: name });
      
      console.log('Kullanıcı başarıyla kaydedildi ve profili güncellendi.');
      
      router.push('/profile');

    } catch (err: any) {
      console.error('Kayıt sırasında detaylı hata:', err); // Detaylı hata için konsola yazdır
      
      // Daha fazla hata kodunu yakala
      if (err.code === 'auth/email-already-in-use') {
        setError('Bu e-posta adresi zaten kullanımda.');
      } else if (err.code === 'auth/weak-password') {
        setError('Şifre çok zayıf. En az 6 karakter olmalıdır.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Geçersiz e-posta adresi formatı.');
      } else {
        setError('Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setIsLoading(false); // <-- YENİ: İşlem bitince (başarılı veya başarısız) yüklenmeyi durdur
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Hesap Oluştur</h2>
        <form onSubmit={handleRegister} className="space-y-6">
          {/* ... input alanları aynı kalacak ... */}
          <div>
            <label htmlFor="name" className="text-sm font-medium text-gray-700">İsim Soyisim</label>
            <input
              id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md" placeholder="Adınız Soyadınız" disabled={isLoading}/>
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">E-posta</label>
            <input
              id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md" placeholder="ornek@mail.com" disabled={isLoading}/>
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Şifre</label>
            <input
              id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md" placeholder="••••••••" disabled={isLoading}/>
          </div>
          
          {error && <p className="text-sm text-center text-red-500">{error}</p>}
          
          <div>
            <button
              type="submit"
              disabled={isLoading} // <-- YENİ: Yüklenirken butonu pasif yap
              className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none disabled:bg-gray-400"
            >
              {isLoading ? 'Kaydediliyor...' : 'Kayıt Ol'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}