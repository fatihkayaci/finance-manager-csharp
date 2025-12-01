import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
function RegisterPage() {

  // ----------------------------------------------------
  // GÖREV ALANI: State'leri ve Fonksiyonları Buraya Yaz
  // ----------------------------------------------------

  // İPUCU 1: Username, Email ve Password için 3 tane useState lazım.
  // İPUCU 2: handleSubmit fonksiyonu içinde fetch ile POST isteği atacaksın.
  // İPUCU 3: API Adresi: http://localhost:5055/api/auth/register
  // İPUCU 4: Başarılı olursa (response.ok), kullanıcıyı Login sayfasına yönlendir (navigate).
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5055/api/auth/register", {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName: userName,
          email: email,
          password: password
        })
      });
      const data = await response.json();
      if (response.ok) {
        alert("Kayıt Başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
        navigate("/login"); // Ana sayfaya fırlat
      } else {
        console.log("Hata:", data);
        alert("Giriş Başarısız: " + data.message);
      }
    } catch (error) {
      console.error("Sunucuya bağlanılamadı:", error);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Kayıt Ol
        </h2>
        
        {/* Form Başlangıcı */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {/* Kullanıcı Adı Alanı */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Kullanıcı Adı
            </label>
            <input 
              type="text" 
              placeholder="johndoe"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          {/* E-Posta Alanı */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              E-Posta
            </label>
            <input 
              type="email" 
              placeholder="ornek@mail.com"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Şifre Alanı */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Şifre
            </label>
            <input 
              type="password" 
              placeholder="******"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Kayıt Ol Butonu */}
          <button 
            type="submit" 
            className="w-full bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700 transition duration-200"
          >
            Kayıt Ol
          </button>

        </form>

        {/* Alt Linkler */}
        <p className="text-center text-gray-500 text-sm mt-4">
          Zaten hesabın var mı? 
          <Link to="/login" className="text-blue-500 font-bold hover:underline ml-1">
            Giriş Yap
          </Link>
        </p>

      </div>
    </div>
  );
}

export default RegisterPage;