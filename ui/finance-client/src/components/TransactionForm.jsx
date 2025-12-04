import { useState, useEffect } from "react";

function TransactionForm({ categories, onSuccess, editingTransaction, setEditingTransaction }) {
  
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    categoryId: "",
    transactionDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        amount: editingTransaction.amount,
        description: editingTransaction.description || "",
        categoryId: editingTransaction.categoryId,
        transactionDate: editingTransaction.transactionDate.split('T')[0]
      });
    } else {
        setFormData({
            amount: "",
            description: "",
            categoryId: "",
            transactionDate: new Date().toISOString().split('T')[0]
        });
    }
  }, [editingTransaction]); 
  // ---------------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const apiUrl = import.meta.env.VITE_API_URL;

    const payload = {
      amount: Number(formData.amount),
      description: formData.description,
      categoryId: Number(formData.categoryId),
      transactionDate: formData.transactionDate
    };

    try {
      let response;
      
      if (editingTransaction) {
        response = await fetch(`${apiUrl}/api/transactions/${editingTransaction.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch(`${apiUrl}/api/transactions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        alert(editingTransaction ? "Güncellendi! ✅" : "Eklendi! 💸");
        
        // Temizlik
        setFormData({
            amount: "",
            description: "",
            categoryId: "",
            transactionDate: new Date().toISOString().split('T')[0]
        });
        setEditingTransaction(null); // Düzenleme modundan çık
        onSuccess(); // Listeyi yenile
      } else {
        alert("Hata oluştu!");
      }
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  // İPTAL BUTONU (Vazgeçmek isterse)
  const handleCancel = () => {
      setEditingTransaction(null);
      setFormData({
        amount: "",
        description: "",
        categoryId: "",
        transactionDate: new Date().toISOString().split('T')[0]
    });
  }

  return (
    <div className={`p-4 rounded-lg border ${editingTransaction ? "bg-yellow-50 border-yellow-200" : "bg-blue-50 border-blue-100"}`}>
      <h3 className={`text-lg font-medium mb-3 ${editingTransaction ? "text-yellow-800" : "text-blue-800"}`}>
        {editingTransaction ? "İşlemi Düzenle ✏️" : "Yeni İşlem Ekle ➕"}
      </h3>
      
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

        <div className="md:col-span-2 flex gap-2">
            <button 
            type="submit"
            className={`flex-1 text-white font-bold py-2 rounded transition-colors ${editingTransaction ? "bg-yellow-600 hover:bg-yellow-700" : "bg-blue-600 hover:bg-blue-700"}`}
            >
            {editingTransaction ? "Güncelle" : "Ekle"}
            </button>

            {editingTransaction && (
                <button 
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-400 text-white font-bold py-2 px-4 rounded hover:bg-gray-500 transition-colors"
                >
                    İptal
                </button>
            )}
        </div>
        
      </form>
    </div>
  );
}

export default TransactionForm;