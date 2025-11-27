function Dashboard({ transactions }) {
  // Logic is in English (Değişkenler İngilizce)
  const income = transactions
    .filter(t => t.categoryType === "Gelir") 
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expense = transactions
    .filter(t => t.categoryType === "Gider")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = income - expense;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      
      {/* GELİR KARTI */}
      <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500 shadow-sm">
        <h3 className="text-gray-500 text-sm uppercase font-bold">Toplam Gelir</h3>
        <p className="text-2xl font-bold text-green-700 mt-1">
          +{income.toLocaleString()} TL
        </p>
      </div>

      {/* GİDER KARTI */}
      <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500 shadow-sm">
        <h3 className="text-gray-500 text-sm uppercase font-bold">Toplam Gider</h3>
        <p className="text-2xl font-bold text-red-700 mt-1">
          -{expense.toLocaleString()} TL
        </p>
      </div>

      {/* BAKİYE KARTI */}
      <div className={`p-4 rounded-lg border-l-4 shadow-sm ${balance >= 0 ? 'bg-blue-50 border-blue-500' : 'bg-orange-50 border-orange-500'}`}>
        <h3 className="text-gray-500 text-sm uppercase font-bold">Net Bakiye</h3>
        <p className={`text-2xl font-bold mt-1 ${balance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
          {balance.toLocaleString()} TL
        </p>
      </div>

    </div>
  );
}

export default Dashboard;