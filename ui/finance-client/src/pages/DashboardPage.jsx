import { useState, useEffect } from 'react'
import TransactionForm from '../components/TransactionForm'
import Dashboard from '../components/Dashboard'
import { data, useNavigate } from 'react-router-dom'
import SummaryChart from '../components/SummaryChart';
const apiUrl = import.meta.env.VITE_API_URL;
function DashboardPage() {
  const [transactions, setTransactions] = useState([]) // İşlemler listesi
  const [categories, setCategories] = useState([])     // Kategori listesi
  const [editingTransaction, setEditingTransaction] = useState(null);
  const navigate = useNavigate();
  const handleLogout = () => {
    // Token'ı sil)
    localStorage.removeItem("token");
    navigate("/login");
  }
  const handleDelete = async (id) => {
    if (!window.confirm("Bu işlemi silmek istediğine emin misin?")) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${apiUrl}/api/transactions/${id}`, {
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
  // Verileri Çeken Fonksiyonlar
  const fetchTransactions = () => {
    const token = localStorage.getItem("token");
    fetch(`${apiUrl}/api/transactions`,{
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status === 401) {
           // (Burası sonra eğer token olmaz ise girecek kod)
        }
        return res.json();
      })
      .then(data => setTransactions(data));
  }
  
  const fetchCategories = () => {
    const token = localStorage.getItem("token");
    fetch(`${apiUrl}/api/categories`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        if (res.status === 401) {
           // (Burası sonra eğer token olmaz ise girecek kod)
        }
        return res.json();
      })
      .then(data => setCategories(data));
  }

  // Sayfa ilk açıldığında çalışacak kod
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
           <SummaryChart transactions={transactions} />
           <TransactionForm 
              categories={categories} 
              onSuccess={fetchTransactions}
              editingTransaction={editingTransaction}
              setEditingTransaction={setEditingTransaction}
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
              {/* Sol Taraf: Tutar ve Açıklama */}
              <div>
                <span className="font-bold text-gray-800 text-lg block">
                  {t.amount} TL
                </span>
                <span className="text-sm text-gray-500">
                  {t.description || "Açıklama yok"}
                </span>
              </div>
              
              {/* Sağ Taraf: Kategori ve Butonlar */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full mr-2">
                  {t.categoryName}
                </span>
                
                {/* --- YENİ EKLENEN: DÜZENLE BUTONU --- */}
                <button 
                  onClick={() => {
                    setEditingTransaction(t); // Veriyi forma taşı
                    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sayfayı yukarı kaydır
                  }}
                  className="text-yellow-500 hover:text-yellow-700 hover:bg-yellow-50 p-2 rounded-full transition-colors"
                  title="Düzenle"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                </button>
                {/* ------------------------------------ */}

                <button 
                  onClick={() => handleDelete(t.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
                  title="Sil"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
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