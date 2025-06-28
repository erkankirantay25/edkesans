// app/register/page.tsx

'use client'; // <-- Bu, yeni düzenimizin anahtarıdır.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase'; // Bu import hala geçerli

export default function RegisterPage() {
  // Tüm state'ler (değişkenler) burada, component'in içinde.
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Form gönderildiğinde çalışacak fonksiyon da burada.
  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Firebase Auth'da kullanıcıyı oluştur
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Firestore'da bu kullanıcı için bir döküman oluştur
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: user.email,
        createdAt: serverTimestamp(),
        role: 'user',
        isBanned: false,
        isActive: true,
      });

      // 3. Kullanıcının Auth profilini güncelle
      await updateProfile(user, { displayName: name });
      
      // Her şey başarılı, kullanıcıyı profil sayfasına yönlendir
      router.push('/profile');

    } catch (err: any) {
      console.error("Kayıt Hatası: ", err.code, err.message);
      if (err.code === 'auth/email-already-in-use') {
        setError('Bu e-posta adresi zaten kullanılıyor.');
      } else if (err.code === 'auth/weak-password') {
        setError('Şifre en az 6 karakter olmalıdır.');
      } else {
        setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Sayfanın HTML (JSX) kısmı
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Hesap Oluştur</h2>
        <form onSubmit={handleRegister} className="mt-8 space-y-6">
          <div>
            <label htmlFor="name">İsim Soyisim</label>
            <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} 
                   className="w-full px-4 py-2 mt-2 border rounded-md" />
          </div>
          <div>
            <label htmlFor="email">E-posta</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                   className="w-full px-4 py-2 mt-2 border rounded-md" />
          </div>
          <div>
            <label htmlFor="password">Şifre</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                   className="w-full px-4 py-2 mt-2 border rounded-md" />
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <button type="submit" disabled={isLoading}
                    className="w-full py-3 px-4 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400">
              {isLoading ? 'Kaydediliyor...' : 'Kayıt Ol'}
            </button>
          </div>
        </form>
        <p className="text-sm text-center">
          Zaten bir hesabın var mı? <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
}