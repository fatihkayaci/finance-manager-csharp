import { useState, useEffect } from 'react'
import TransactionForm from './components/TransactionForm'

function App() {
  const [transactions, setTransactions] = useState([]) // İşlemler listesi
  const [categories, setCategories] = useState([])     // Kategori listesi (Dropdown için)

  // 1. Verileri Çeken Fonksiyonlar
  const fetchTransactions = () => {
    fetch('http://localhost:5055/api/transactions')
      .then(res => res.json())
      .then(data => setTransactions(data));
  }
  
  const fetchCategories = () => {
    fetch('http://localhost:5055/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data));
  }

  // 2. Sayfa ilk açıldığında çalışacak kod
  useEffect(() => {
    fetchCategories();
    fetchTransactions();
  }, [])

  return (
    // min-h-screen: Ekranı tam kapla, bg-gray-100: Açık gri arka plan
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          💰 Gelir-Gider Takip
        </h1>

        {/* Form Bileşeni */}
        <div className="mb-8">
          <TransactionForm 
            categories={categories} 
            onSuccess={fetchTransactions} 
          />
        </div>

        <hr className="my-6 border-gray-200" />

        {/* Liste Başlığı */}
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Son İşlemler
        </h3>

        {/* Liste Alanı */}
        <ul className="space-y-3">
          {transactions.map(t => (
            <li 
              key={t.id} 
              className="flex justify-between items-center p-4 bg-gray-50 rounded border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div>
                <span className="font-bold text-gray-800 text-lg block">
                  {t.amount} TL
                </span>
                <span className="text-sm text-gray-500">
                  {t.description || "Açıklama yok"}
                </span>
              </div>
              
              <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
                {t.categoryName}
              </span>
            </li>
          ))}
        </ul>
        
        {transactions.length === 0 && (
          <p className="text-center text-gray-400 mt-4">Henüz işlem yok.</p>
        )}
      </div>
    </div>
  )
}

export default App