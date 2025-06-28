// components/DemandList.tsx

import { Demand } from "@/types";
import { format } from 'date-fns'; // Tarih formatlamak için (npm install date-fns)

export default function DemandList({ demands }: { demands: Demand[] }) {
  if (demands.length === 0) {
    return <p className="text-gray-500">Bu ürün için henüz talep girilmemiş.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Sıra</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Kullanıcı Kodu</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Talep Tarihi</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Miktar</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Durum</th>
          </tr>
        </thead>
        <tbody>
          {demands.map((demand, index) => (
            <tr key={demand.id} className="border-t">
              <td className="px-4 py-3 text-sm">{index + 1}</td>
              <td className="px-4 py-3 text-sm font-medium">{demand.userCode}</td>
              <td className="px-4 py-3 text-sm">
                {demand.createdAt ? format(demand.createdAt.toDate(), 'dd.MM.yyyy HH:mm') : 'Bilinmiyor'}
              </td>
              <td className="px-4 py-3 text-sm">{demand.quantity} gr</td>
              <td className="px-4 py-3 text-sm">
                 <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    demand.status === 'valid' ? 'bg-green-100 text-green-800' : 
                    demand.status === 'pending_quota' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                 }`}>
                    {demand.status === 'valid' ? 'Geçerli' : 
                     demand.status === 'pending_quota' ? 'Kota Bekliyor' : 'Geçersiz'}
                 </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}