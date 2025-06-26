
export default function ProfileDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Genel Bakış</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">Hoş Geldin, Erkan!</h2>
        <p className="mt-2 text-gray-600">
          Hesap panelinden siparişlerini takip edebilir, adres ve kişisel bilgilerini güncelleyebilirsin.
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Toplam Sipariş</p>
                <p className="text-2xl font-bold">5</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Bekleyen Sipariş</p>
                <p className="text-2xl font-bold">1</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Favori Ürün</p>
                <p className="text-2xl font-bold">12</p>
            </div>
        </div>
      </div>
    </div>
  );
}