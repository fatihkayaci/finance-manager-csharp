import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function SummaryChart({ transactions }) {
  
  // 1. VERİYİ HAZIRLAMA (Gruplama Mantığı)
  // Sadece "Gider" olanları alıp kategorilerine göre topluyoruz.
  const data = transactions
    .filter(t => t.categoryType === "Expense")
    .reduce((acc, curr) => {
      const existing = acc.find(item => item.name === curr.categoryName);
      if (existing) {
        existing.value += curr.amount;
      } else {
        acc.push({ name: curr.categoryName, value: curr.amount });
      }
      return acc;
    }, []);

  // Grafikte kullanılacak renkler (Tailwind renklerine uyumlu)
  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

  if (data.length === 0) {
    return <p className="text-center text-gray-400 py-10">Grafik için henüz gider verisi yok.</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mb-6">
      <h3 className="text-lg font-bold text-gray-700 mb-4 text-center">Gider Dağılımı 📉</h3>
      
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60} // Ortası delik (Donut) olması için
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label // Çizgili etiketler
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value} TL`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SummaryChart;