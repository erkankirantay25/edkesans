// app/register/page.tsx

'use client'; // Bu satır önemli, tarayıcıda çalışacak bir component olduğunu belirtir.

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
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      // 1. Firebase Authentication ile kullanıcıyı oluştur
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Kullanıcının profilindeki görünen ismini güncelle
      await updateProfile(user, { displayName: name });

      // 3. Firestore'da kullanıcı için bir profil dökümanı oluştur
      // Not: userCode ve diğer bazı alanlar Cloud Function tarafından otomatik eklenecek.
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        name: name,
        email: user.email,
        createdAt: serverTimestamp(), // Kayıt tarihini sunucu saatiyle ekle
        role: 'user',
        isBanned: false,
        isActive: true,
      });

      console.log('Kullanıcı başarıyla kaydedildi ve Firestore profili oluşturuldu.');
      
      // Kayıt başarılı olduktan sonra kullanıcıyı profil sayfasına yönlendir
      router.push('/profile');

    } catch (err: any) {
      console.error('Kayıt sırasında hata:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Bu e-posta adresi zaten kullanımda.');
      } else {
        setError('Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Hesap Oluştur</h2>
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label htmlFor="name" className="text-sm font-medium text-gray-700">İsim Soyisim</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Adınız Soyadınız"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">E-posta</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="ornek@mail.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Şifre</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-center text-red-500">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Kayıt Ol
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}