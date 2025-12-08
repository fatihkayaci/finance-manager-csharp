import { useState, useEffect } from 'react'
import TransactionForm from '../components/TransactionForm'

const apiUrl = import.meta.env.VITE_API_URL;

// DİKKAT: Props olarak 'transactions' (veri) ve 'refreshData' (yenileme fonksiyonu) alıyoruz
function TransactionAdd({ refreshData, categories }) {
  
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Kategoriler sadece bu sayfada lazım olduğu için burada kalabilir

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-xl">
        
        {/* Form işlem başarılı olunca refreshData'yı çalıştıracak */}
        <TransactionForm 
            categories={categories} 
            onSuccess={refreshData} 
            editingTransaction={editingTransaction}
            setEditingTransaction={setEditingTransaction}
        />
      </div>
    </div>
  )
}

export default TransactionAdd