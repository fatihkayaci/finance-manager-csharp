import { useState, useEffect } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

const TransactionList = ({ transactions = [], refreshData, categories }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: "",
    amount: "",
    description: "",
    category: "" // Veya categoryId, backend yapına göre
  });
  const handleDelete = (id) => {
    // Kullanıcıya onay soralım
    if (!window.confirm("Bu işlemi silmek istediğine emin misin?")) return;

    const token = localStorage.getItem("token");

    fetch(`${apiUrl}/api/transactions/${id}`, {
      method: 'DELETE', // Silme metodu
      headers: {
        'Authorization': `Bearer ${token}`, // Güvenlik için token şart
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.ok) {
        refreshData();
      } else {
        alert("Silme işlemi başarısız oldu.");
      }
    })
    .catch(err => console.error("Silme hatası:", err));
  };

  const openEditModal = (transaction) => {
    setEditFormData({
      id: transaction.id,
      amount: transaction.amount,
      description: transaction.description,
      categoryId: transaction.categoryId || ""
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditFormData({ id: "", amount: "", description: "", category: "" });
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const updateData = {
        amount: Number(editFormData.amount),
        description: editFormData.description,
        categoryId: Number(editFormData.categoryId)
      };

      const res = await fetch(`${apiUrl}/api/transactions/${editFormData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (res.ok) {
        alert("İşlem başarıyla güncellendi.");
        closeModal();
        refreshData();
      } else {
        const errorData = await res.json();
        alert(`Güncelleme başarısız: ${errorData.message || "Bilinmeyen hata"}`);
      }
    } catch (err) {
      console.error("Güncelleme hatası:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-xl">
        <ul className="space-y-3">
          {/* Prop olarak gelen transactions'ı map ediyoruz */}
          {transactions.map(t => (
            <li key={t.id} className="flex justify-between items-center p-4 bg-gray-50 rounded border border-gray-200">
              
              <div>
                <span className="font-bold text-gray-800 text-lg block">{t.amount} TL</span>
                <span className="text-sm text-gray-500">{t.description}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full mr-2">
                  {t.categoryName}
                </span>

                <button 
                  onClick={() => openEditModal(t)}
                  className="text-yellow-500 hover:bg-yellow-50 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                </button>

                <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full">
                  
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
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">İşlemi Düzenle</h3>
            
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tutar</label>
                <input
                  type="number"
                  name="amount"
                  value={editFormData.amount}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                <input
                  type="text"
                  name="description"
                  value={editFormData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Kategori</label>
                <select
                  name="categoryId"
                  value={editFormData.categoryId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white"
                  required
                >
                  <option value="">Kategori Seçiniz</option>
                  {categories.map((cat) => (
                    // API'den dönen kategorilerin yapısına göre cat.id ve cat.name kullan
                    <option key={cat.id} value={cat.id}>
                      {cat.name} 
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;