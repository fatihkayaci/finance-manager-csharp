import SummaryChart from '../components/SummaryChart';
import DashboardStats from "../components/DashboardState";

export default function Dashboard({ transactionsData = [] }) {
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-xl">
        
        <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Genel Bakış</h1>
        {/* --- GRAFİK ALANI --- */}
        <div className="mt-8 border-t pt-6">
           <h2 className="text-lg font-bold text-gray-700 mb-4">Grafik Özeti</h2>
           <SummaryChart transactions={transactionsData} />
        </div>
        
        {/* --- 1. GÜNLÜK İSTATİSTİKLER --- */}
        
        <DashboardStats transactionsData={transactionsData} />
        

      </div>
    </div>
  );
}