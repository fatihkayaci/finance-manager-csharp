import { useState, useEffect } from 'react'
import TransactionForm from '../components/TransactionForm'
import Dashboard from '../components/Dashboard'
import { data, useNavigate } from 'react-router-dom'
import SummaryChart from '../components/SummaryChart';
function DashboardPage() {
  const [transactions, setTransactions] = useState([]) // İşlemler listesi
  const [categories, setCategories] = useState([])     // Kategori listesi (Dropdown için)
  const navigate = useNavigate();
  const handleLogout = () => {
    // 1. Bileti Yırt (Token'ı sil)
    localStorage.removeItem("token");
    
    // 2. Kapı Dışarı Et
    navigate("/login");
  }
  const handleDelete = async (id) => {
    if (!window.confirm("Bu işlemi silmek istediğine emin misin?")) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:5055/api/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setTransactions(prev => prev.filter(t => t.id !== id));
      } else {
        alert("Silinemedi! Sunucu hatası.");
      }
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  }
  // 1. Verileri Çeken Fonksiyonlar
  const fetchTransactions = () => {
    const token = localStorage.getItem("token");
    fetch('http://localhost:5055/api/transactions',{
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // "Bearer " boşluğuna dikkat!
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status === 401) {
           // (Burayı sonra konuşuruz, şimdilik veriyi çekmeye odaklanalım)
        }
        return res.json();
      })
      .then(data => setTransactions(data));
  }
  
  const fetchCategories = () => {
    const token = localStorage.getItem("token");
    fetch('http://localhost:5055/api/categories',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // "Bearer " boşluğuna dikkat!
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        // Eğer 401 gelirse (Token süresi bitmiş olabilir), kullanıcıyı atabiliriz
        if (res.status === 401) {
        }
        return res.json();
      })
      .then(data => setCategories(data));
  }

  // 2. Sayfa ilk açıldığında çalışacak kod
  useEffect(() => {
    fetchCategories();
    fetchTransactions();
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-xl">
        
        <nav className="w-full bg-white shadow-md p-4 flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-blue-600">
            💰 Finance Manager
          </h1>
          <button 
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Çıkış Yap 🚪
          </button>
        </nav>
        
        {/* Dashboard Component */}
        <Dashboard transactions={transactions} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
           {/* Sol Taraf: Grafik */}
           <SummaryChart transactions={transactions} />
           
           {/* Sağ Taraf: Ekleme Formu (Mevcut formu buraya taşıdık ki yan yana dursunlar) */}
           <TransactionForm 
              categories={categories} 
              onSuccess={fetchTransactions} 
           />
        </div>
        <hr className="my-6 border-gray-200" />

        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Son İşlemler
        </h3>

        {/* List Items */}
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
              <button 
                  onClick={() => handleDelete(t.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
                  title="Sil"
              >
                  {/* Çöp Kutusu İkonu (SVG) */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
              </button>
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

export default DashboardPage