import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react'

function LoginPage() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch('http://localhost:5055/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: email, 
                password: password 
            }) 
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Giriş Başarılı! Token:", data.token);
            
            // Token'ı cebe at (LocalStorage)
            localStorage.setItem("token", data.token);
            
            alert("Hoşgeldiniz!");
            navigate("/"); // Ana sayfaya fırlat
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
          Giriş Yap
        </h2>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          
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

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Giriş Yap
          </button>

        </form>

        <p className="text-center text-gray-500 text-sm mt-4">
          Hesabın yok mu? 
          <Link to="/register" className="text-blue-500 font-bold hover:underline ml-1">
            Kayıt Ol
          </Link>
        </p>

      </div>
    </div>
  );
}

export default LoginPage;