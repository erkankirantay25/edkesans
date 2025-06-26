
// Sahte sipariş verileri
const sampleOrders = [
  { id: 'TR-12345', date: '15.10.2023', total: 1250, status: 'Teslim Edildi' },
  { id: 'TR-12358', date: '28.10.2023', total: 980, status: 'Teslim Edildi' },
  { id: 'TR-12401', date: '05.11.2023', total: 2250, status: 'Kargoda' },
  { id: 'TR-12415', date: '10.11.2023', total: 750, status: 'İptal Edildi' },
];

export default function MyOrdersPage() {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Teslim Edildi': return 'bg-green-100 text-green-800';
      case 'Kargoda': return 'bg-blue-100 text-blue-800';
      case 'İptal Edildi': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Siparişlerim</h1>
      <div className="space-y-4">
        {sampleOrders.map((order) => (
          <div key={order.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-800">Sipariş #{order.id}</p>
              <p className="text-sm text-gray-500">{order.date}</p>
            </div>
            <div>
              <p className="font-semibold">{order.total} TL</p>
            </div>
            <div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(order.status)}`}>
                {order.status}
              </span>
            </div>
            <button className="text-sm text-indigo-600 hover:underline">Detayları Görüntüle</button>
          </div>
        ))}
      </div>
    </div>
  );
}