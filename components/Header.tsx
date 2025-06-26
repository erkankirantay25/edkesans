'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* LOGO */}
          <Link href="/" className="text-2xl font-bold text-gray-800" onClick={closeMenu}>
            ESANSCIM
          </Link>

          {/* MASAÜSTÜ (WEB) MENÜSÜ - Sadece büyük ekranlarda görünür */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-600 hover:text-black">Ana Sayfa</Link>
            <Link href="/products" className="text-gray-600 hover:text-black">Ürünler</Link>
            <Link href="/about" className="text-gray-600 hover:text-black">Hakkımızda</Link>
            <Link href="/contact" className="text-gray-600 hover:text-black">İletişim</Link>
          </nav>
          
          {/* MASAÜSTÜ (WEB) SAĞ TARAF - Sadece büyük ekranlarda görünür */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-black">
              Giriş Yap
            </Link>
            <span className="h-6 w-px bg-gray-300" aria-hidden="true" />
            <Link href="/cart" className="text-gray-600 hover:text-black" aria-label="Alışveriş Sepeti">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </Link>
          </div>

          {/* MOBİL HAMBURGER BUTONU - Sadece küçük ekranlarda görünür */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="text-gray-600 hover:text-black"
              aria-label="Menüyü aç"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* MOBİL MENÜ PANELİ - Tıklanınca açılır */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div 
          className="absolute inset-0 bg-black bg-opacity-50" 
          onClick={closeMenu}
        ></div>
        
        <div className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white p-6 shadow-xl transition-transform duration-300 ${isMenuOpen ? 'transform-none' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold">Menü</h2>
            <button
              onClick={closeMenu}
              className="text-gray-500 hover:text-black"
              aria-label="Menüyü kapat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col space-y-2">
            <Link href="/" className="px-4 py-3 text-lg rounded-md hover:bg-gray-100" onClick={closeMenu}>Ana Sayfa</Link>
            <Link href="/products" className="px-4 py-3 text-lg rounded-md hover:bg-gray-100" onClick={closeMenu}>Tüm Ürünler</Link>
            <hr className="my-2"/>
            <Link href="/profile" className="px-4 py-3 text-lg rounded-md hover:bg-gray-100" onClick={closeMenu}>Profilim</Link>
            <Link href="/profile/orders" className="px-4 py-3 text-lg rounded-md hover:bg-gray-100" onClick={closeMenu}>Siparişlerim</Link>
            <Link href="/cart" className="px-4 py-3 text-lg rounded-md hover:bg-gray-100" onClick={closeMenu}>Sepetim</Link>
            <hr className="my-2"/>
            <Link href="/login" className="mt-4 py-3 text-lg bg-gray-800 text-white text-center rounded-md hover:bg-gray-900" onClick={closeMenu}>
              Giriş Yap / Üye Ol
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}