// src/App.jsx
import { useState, useEffect } from "react"; // useEffect eklemeyi unutma
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TransactionAdd from "./pages/TransactionAdd";
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from "./components/MainLayout"; // Yeni oluşturduğumuz dosya
import TransactionList from "./pages/TransactionList";
import AddCategory from './pages/AddCategory';
const apiUrl = import.meta.env.VITE_API_URL; // API URL'i buraya al

function App() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([])

  // Veriyi çeken ana fonksiyon
  const fetchTransactions = () => {
    const token = localStorage.getItem("token");
    if (!token) return; // Token yoksa çekme

    fetch(`${apiUrl}/api/transactions`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => setTransactions(data))
    .catch(err => console.error(err));
  }

  const fetchCategories = () => {
    const token = localStorage.getItem("token");
    fetch(`${apiUrl}/api/categories`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setCategories(data));
  }

  // Uygulama ilk açıldığında veriyi çek
  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* ... Login/Register route'ları ... */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* DASHBOARD */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <MainLayout>
                {/* Sadece veriyi gönderiyoruz */}
                <Dashboard transactionsData={transactions}/>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* TRANSACTIONS (İŞLEMLER) */}
        <Route 
          path="/transactionAdd" 
          element={
            <ProtectedRoute>
              <MainLayout>
                {/* Hem veriyi hem de yenileme fonksiyonunu gönderiyoruz */}
                <TransactionAdd
                  refreshData={fetchTransactions} 
                  categories={categories} 
                />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/transactionList" 
          element={
            <ProtectedRoute>
              <MainLayout>
                {/* Hem veriyi hem de yenileme fonksiyonunu gönderiyoruz */}
                <TransactionList 
                  transactions={transactions}
                  refreshData={fetchTransactions}
                  categories={categories}/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/categoryAdd" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddCategory />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;