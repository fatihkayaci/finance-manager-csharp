import { Link, useNavigate } from "react-router-dom";

// DİKKAT: Artık userName verisini yukarıdan (parent bileşenden) prop olarak alıyoruz.
export default function Navbar({ userName }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* --- SOL: LOGO --- */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition">
              💰 Finance Manager
            </Link>
          </div>

          {/* --- ORTA: MENÜ (Mobil için gizli, masaüstü için görünür) --- */}
          <div className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className="text-gray-900 font-medium hover:text-blue-600 transition"
            >
              Dashboard
            </Link>
            {/* Ortadaki linki dilersen kaldırabilirsin, çünkü artık buton var */}
            <Link 
              to="/transactionList" 
              className="text-gray-500 font-medium hover:text-blue-600 transition"
            >
              İşlemler Listesi
            </Link>
          </div>

          {/* --- SAĞ: PROFİL VE BUTONLAR --- */}
          <div className="flex items-center gap-3">
            
            {/* Kullanıcı Bilgisi */}
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-semibold text-gray-700">
                {userName}
              </span>
              <span className="text-xs text-gray-500">Kullanıcı</span>
            </div>

            {/* ✨ YENİ EKLENEN BUTON: İşlemler'e Git ✨ */}
            <button 
              onClick={() => navigate("/transactionAdd")}
              className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
            >
              Yeni İşlem Ekle +
            </button>

            {/* Çıkış Butonu */}
            <button 
              onClick={handleLogout}
              className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition"
            >
              Çıkış Yap
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};