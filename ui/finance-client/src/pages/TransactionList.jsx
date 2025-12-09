import { useState } from "react";
import TransactionFilter from "../components/TransactionFilter";
const apiUrl = import.meta.env.VITE_API_URL;

const TransactionList = ({ transactions = [], refreshData, categories = [] }) => {
  // --- STATE'LER (Filtreleme) ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // --- STATE'LER (Düzenleme / Modal) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: "",
    amount: "",
    description: "",
    categoryId: "",
    transactionDate: "", // Tarihi de düzenlemek istersen diye ekledim
  });

  // --- FİLTRELEME MANTIĞI ---
  const filteredTransactions = transactions.filter((t) => {
    // 1. Arama Metni Kontrolü
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Kategori Kontrolü
    const matchesCategory = filterCategory === "" || Number(t.categoryId) === Number(filterCategory);
    
    // 3. Tarih Kontrolü (Saatleri sıfırlayarak kıyaslıyoruz)
    const tDate = new Date(t.transactionDate);
    tDate.setHours(0, 0, 0, 0);

    let matchesStartDate = true;
    if (startDate) {
      const sDate = new Date(startDate);
      sDate.setHours(0, 0, 0, 0);
      matchesStartDate = tDate.getTime() >= sDate.getTime();
    }

    let matchesEndDate = true;
    if (endDate) {
      const eDate = new Date(endDate);
      eDate.setHours(0, 0, 0, 0);
      matchesEndDate = tDate.getTime() <= eDate.getTime();
    }

    return matchesSearch && matchesCategory && matchesStartDate && matchesEndDate;
  });

  // --- CRUD: SİLME İŞLEMİ (DELETE) ---
  const handleDelete = async (id) => {
    if (!window.confirm("Bu işlemi silmek istediğine emin misin?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/api/transactions/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        refreshData(); // Listeyi yenile
      } else {
        alert("Silme işlemi başarısız oldu.");
      }
    } catch (error) {
      console.error("Silme hatası:", error);
      alert("Bir hata oluştu.");
    }
  };

  // --- CRUD: MODAL AÇMA (EDIT HAZIRLIĞI) ---
  const openEditModal = (transaction) => {
    // Tarih inputuna value atayabilmek için format (YYYY-MM-DD) düzeltmesi
    const dateObj = new Date(transaction.transactionDate);
    const formattedDate = dateObj.toISOString().split('T')[0];

    setEditFormData({
      id: transaction.id,
      amount: transaction.amount,
      description: transaction.description,
      categoryId: transaction.categoryId || "",
      transactionDate: formattedDate
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditFormData({ id: "", amount: "", description: "", categoryId: "", transactionDate: "" });
  };

  // --- CRUD: FORM INPUT DEĞİŞİKLİĞİ ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- CRUD: GÜNCELLEME İŞLEMİ (UPDATE / PUT) ---
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Backend'e gidecek veri formatı
    const updatePayload = {
        amount: Number(editFormData.amount),
        description: editFormData.description,
        categoryId: Number(editFormData.categoryId),
        transactionDate: new Date(editFormData.transactionDate).toISOString()
    };

    try {
      const response = await fetch(`${apiUrl}/api/transactions/${editFormData.id}`, {
        method: "PUT", // veya PATCH
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      });

      if (response.ok) {
        refreshData(); // Ana veriyi yenile
        closeModal();  // Modalı kapat
      } else {
        const errData = await response.json();
        alert(`Güncelleme başarısız: ${errData.message || "Bilinmeyen hata"}`);
      }
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      alert("Sunucuya bağlanırken hata oluştu.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-4xl px-4">
        

        <div className="bg-white p-6 rounded-lg shadow-xl w-full">
           
           {/* 2. FİLTRELEME ALANI (TransactionFilter Bileşeni) */}
           <TransactionFilter 
              searchTerm={searchTerm} setSearchTerm={setSearchTerm}
              filterCategory={filterCategory} setFilterCategory={setFilterCategory}
              startDate={startDate} setStartDate={setStartDate}
              endDate={endDate} setEndDate={setEndDate}
              categories={categories}
           />

           {/* 3. İŞLEM LİSTESİ */}
           <div className="mt-4">
             <h3 className="text-lg font-bold text-gray-700 mb-4">İşlem Geçmişi</h3>
             
             {filteredTransactions.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Kriterlere uygun işlem bulunamadı.</p>
             ) : (
                <ul className="space-y-3">
                  {filteredTransactions.map((t) => (
                    <li key={t.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 transition-colors">
                      
                      {/* Sol Taraf: Tutar, Tarih, Açıklama */}
                      <div className="mb-2 sm:mb-0 w-full sm:w-auto">
                        <div className="flex items-center gap-3">
                            <span className={`font-bold text-lg ${t.categoryType === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                              {t.categoryType === 'Income' ? '+' : '-'}{t.amount} TL
                            </span>
                            <span className="text-xs text-gray-400 border-l border-gray-300 pl-2">
                              {new Date(t.transactionDate).toLocaleDateString("tr-TR")}
                            </span>
                        </div>
                        <span className="text-sm text-gray-600 block mt-1">{t.description}</span>
                      </div>
                      
                      {/* Sağ Taraf: Kategori Badge, Edit, Delete */}
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-end mt-2 sm:mt-0">
                        <span className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full truncate max-w-[100px] sm:max-w-none">
                          {t.categoryName || "Genel"}
                        </span>

                        {/* Düzenle Butonu */}
                        <button 
                          onClick={() => openEditModal(t)} 
                          className="text-yellow-500 hover:bg-yellow-100 p-2 rounded-full transition-colors"
                          title="Düzenle"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                        </button>

                        {/* Sil Butonu */}
                        <button 
                          onClick={() => handleDelete(t.id)} 
                          className="text-red-500 hover:bg-red-100 p-2 rounded-full transition-colors"
                          title="Sil"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
             )}
           </div>
        </div>

        {/* --- DÜZENLEME MODALI --- */}
        {isModalOpen && (
             <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
                <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md transform transition-all scale-100">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h3 className="text-xl font-bold text-gray-800">İşlemi Düzenle</h3>
                        <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                    </div>

                    <form onSubmit={handleUpdateSubmit} className="space-y-4">
                        {/* Tutar */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tutar</label>
                            <input 
                                type="number" 
                                name="amount"
                                value={editFormData.amount} 
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>

                        {/* Açıklama */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                            <input 
                                type="text" 
                                name="description"
                                value={editFormData.description} 
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>

                        {/* Kategori */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                            <select 
                                name="categoryId"
                                value={editFormData.categoryId} 
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                required
                            >
                                <option value="" disabled>Kategori Seçin</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Tarih */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
                            <input 
                                type="date"
                                name="transactionDate"
                                value={editFormData.transactionDate} 
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                required 
                            />
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button 
                                type="button" 
                                onClick={closeModal}
                                className="flex-1 py-2 px-4 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                İptal
                            </button>
                            <button 
                                type="submit" 
                                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow-md"
                            >
                                Güncelle
                            </button>
                        </div>
                    </form>
                </div>
             </div>
        )}

      </div>
    </div>
  );
};

export default TransactionList;