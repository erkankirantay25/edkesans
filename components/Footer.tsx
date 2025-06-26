// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="container mx-auto px-4 py-8 text-center">
        <p>© {new Date().getFullYear()} ESANSCIM Tüm hakları saklıdır.</p>
        <p className="text-sm text-gray-400 mt-2">Gizlilik Politikası</p>
      </div>
    </footer>
  );
}