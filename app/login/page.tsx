// app/login/page.tsx

'use client'; // Bu sayfa interaktif olacak (form girişi)

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Sayfanın yeniden yüklenmesini engelle
    setError(null);

    try {
      // Firebase'in giriş yapma fonksiyonunu kullan
      await signInWithEmailAndPassword(auth, email, password);
      
      // Giriş başarılı! Kullanıcıyı profil sayfasına yönlendir.
      // İsteğiniz üzerine bu satırı güncelledik.
      router.push('/profile');

    } catch (err: any) {
      console.error("Giriş sırasında hata:", err.code);
      // Kullanıcıya daha anlaşılır hata mesajları göster
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('E-posta veya şifre hatalı.');
      } else {
        setError('Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center py-10 min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Giriş Yap
        </h1>
        {/* Formun 'onSubmit' olayını handleLogin fonksiyonuna bağlıyoruz */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* E-posta Alanı */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700"
            >
              E-posta Adresi
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email} // State'e bağladık
              onChange={(e) => setEmail(e.target.value)} // Değişiklikleri state'e yansıt
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Şifre Alanı */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700"
            >
              Şifre
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password} // State'e bağladık
              onChange={(e) => setPassword(e.target.value)} // Değişiklikleri state'e yansıt
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Hata Mesajı Alanı */}
          {error && <p className="text-sm text-center text-red-500">{error}</p>}

          {/* Buton */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              Giriş Yap
            </button>
          </div>
        </form>
        
        {/* Üye Olma Linki */}
        <p className="text-sm text-center text-gray-600">
          Hesabın yok mu?{' '}
          <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Hemen üye ol
          </Link>
        </p>
      </div>
    </div>
  );
}