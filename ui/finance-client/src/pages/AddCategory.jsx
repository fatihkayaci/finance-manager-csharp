import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// API URL'ini ortam değişkeninden alıyoruz
const apiUrl = import.meta.env.VITE_API_URL;

const AddCategory = () => {
  const navigate = useNavigate();
  
  // Form State'leri
  const [categoryName, setCategoryName] = useState('');
  const [categoryType, setCategoryType] = useState('Expense'); // Varsayılan: Gider
  const [color, setColor] = useState('#3b82f6'); // Varsayılan: Mavi

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token");

    // Backend DTO'su: { Name: string, Type: string }
    const newCategory = { 
        name: categoryName, 
        type: categoryType,
        color: color 
    };

    console.log("Backende Giden Veri:", newCategory);

    try {
        const response = await fetch(`${apiUrl}/api/categories`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify(newCategory),
        });

        if (response.ok) {
            alert("Kategori başarıyla eklendi.");
            navigate('/'); // İşlem bitince anasayfaya dön
        } else {
            const errorData = await response.json();
            alert(`Hata: ${errorData.message || "Kategori eklenemedi"}`);
        }

    } catch (error) {
        console.error("Bağlantı hatası:", error);
        alert("Sunucuya bağlanılamadı.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-10">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Yeni Kategori Oluştur</h1>
        
        <form onSubmit={handleSubmit}>
          
          {/* 1. KATEGORİ İSMİ */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori İsmi
            </label>
            <input 
              type="text" 
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Örn: Market, Maaş..."
              required
            />
          </div>

          {/* 2. TÜR SEÇİMİ (Income/Expense) */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori Türü
            </label>
            <select
              value={categoryType}
              onChange={(e) => setCategoryType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition"
            >
              {/* Ekranda Türkçe yazar, Backende value (İngilizce) gider */}
              <option value="Expense">Gider</option>
              <option value="Income">Gelir</option>
            </select>
          </div>

          {/* 3. RENK SEÇİMİ (Opsiyonel Görsel) */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Renk Seç
            </label>
            <div className="flex justify-between gap-2">
              {['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#6366f1'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    color === c ? 'border-black scale-110 shadow-md' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* AKSİYON BUTONLARI */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)} // Bir önceki sayfaya döner
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm transition"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;