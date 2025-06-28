// app/login/page.tsx

'use client'; // <-- Bizim yeni kuralımız! Her şey tarayıcıda çalışacak.

import { useState } from 'react';
import Link from 'next/link';
// import { useRouter } from 'next/navigation';

// Şimdilik Firebase'i import etmiyoruz, sadece butonun çalıştığını test edelim.
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '../../lib/firebase'; // Bu yolu daha sonra düzelteceğiz

export default function LoginPage() {
  // Değişkenlerimizi ve fonksiyonlarımızı burada, dosyanın içinde tanımlıyoruz.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // const router = useRouter();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Sayfanın yenilenmesini engelle
    setError('');

    // Butonun çalıştığını test etmek için bir uyarı gösterelim.
    alert(`Giriş denemesi: E-posta: ${email}, Şifre: ${password}`);

    // Firebase bağlantısını daha sonra buraya ekleyeceğiz.
  };

  return (
    // Burası da sayfanın HTML kısmı.
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Giriş Yap</h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email">E-posta Adresi</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label htmlFor="password">Şifre</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          <div>
            <button type="submit" className="w-full py-2 px-4 font-bold text-white bg-gray-800 hover:bg-gray-900">
              Giriş Yap
            </button>
          </div>
        </form>
        
        <p className="text-sm text-center">
          Hesabın yok mu?{' '}
          <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Hemen üye ol
          </Link>
        </p>
      </div>
    </div>
  );
}
