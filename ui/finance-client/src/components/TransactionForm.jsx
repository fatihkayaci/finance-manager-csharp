import { useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;
function TransactionForm({ categories, onSuccess }) {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    categoryId: "",
    transactionDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      amount: Number(formData.amount),
      description: formData.description,
      categoryId: Number(formData.categoryId),
      transactionDate: formData.transactionDate
    };

    const token = localStorage.getItem("token");
    fetch(`${apiUrl}/api/transactions`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (res.status === 401) {
           // (Burası sonra eğer token olmaz ise girecek kod)
        }
        if (res.ok) {
          alert("İşlem Başarıyla Eklendi! 💸");
          setFormData({ ...formData, amount: "", description: "" });
          onSuccess();
        } else {
          alert("Bir hata oluştu!");
        }
      });
  };

  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
      <h3 className="text-lg font-medium text-blue-800 mb-3">Yeni İşlem Ekle</h3>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <input 
          type="number" 
          placeholder="Tutar (TL)" 
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: e.target.value})}
          required 
        />
        
        <select 
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          value={formData.categoryId} 
          onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
          required
        >
          <option value="">Kategori Seçiniz</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <input 
          type="text" 
          placeholder="Açıklama (Örn: Market)" 
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 md:col-span-2"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />

        <input 
          type="date" 
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 md:col-span-2"
          value={formData.transactionDate}
          onChange={(e) => setFormData({...formData, transactionDate: e.target.value})}
        />

        <button 
          type="submit"
          className="md:col-span-2 bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition-colors"
        >
          ➕ Ekle
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;