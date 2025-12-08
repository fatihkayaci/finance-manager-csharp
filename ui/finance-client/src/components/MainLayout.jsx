import Navbar from "./Navbar";

export default function MainLayout({ children }) {
  const userName = localStorage.getItem("userName") || "Kullanıcı";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={userName} />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}