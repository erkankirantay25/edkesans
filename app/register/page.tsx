// app/register/page.tsx

'use client'; // Bu sayfa interaktif (form içeriyor), o yüzden en başa bunu yazıyoruz.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

// ÖNEMLİ: Firebase ayar dosyasını import etmemiz lazım.
// Bu dosyayı bir sonraki adımda oluşturacağız.
import { auth, db } from '../../lib/firebase';

export default function RegisterPage() {
  // Formdaki bilgileri tutmak için state'ler
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // "Kayıt Ol" butonuna basıldığında çalışacak fonksiyon
  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Firebase'de kullanıcıyı oluştur
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Veritabanında bu kullanıcı için bir döküman oluştur
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: user.email,
        createdAt: serverTimestamp(),
        role: 'user', // Varsayılan rol
        isBanned: false,
        isActive: true,
      });

      // Kullanıcının görünen ismini güncelle
      await updateProfile(user, { displayName: name });
      
      // Başarılı! Profil sayfasına yönlendir.
      router.push('/profile');

    } catch (err: any) {
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center">Hesap Oluştur</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">İsim Soyisim</label>
            <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} 
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-posta</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Şifre</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <div>
            <button type="submit" disabled={isLoading}
                    className="w-full py-2 px-4 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-500">
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
