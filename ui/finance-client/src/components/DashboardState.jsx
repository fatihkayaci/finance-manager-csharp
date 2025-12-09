import React, { useMemo } from 'react';
import StatCard from './StatCard'; // Yeni bileşeni import ettik

const DashboardStats = ({ transactionsData = [] }) => {
  
   // --- HESAPLAMALAR ---
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Bu haftanın başlangıcı (Pazartesi)
    const startOfWeek = new Date(today);
    const day = startOfWeek.getDay() || 7; // Pazar=7, Pzt=1 olsun
    if (day !== 1) startOfWeek.setHours(-24 * (day - 1));

    // Bu ayın başlangıcı
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Veri saklama objeleri
    let daily = { income: 0, expense: 0 };
    let weekly = { income: 0, expense: 0 };
    let monthly = { income: 0, expense: 0 };

    transactionsData.forEach((t) => {
      const tDate = new Date(t.transactionDate);
      tDate.setHours(0, 0, 0, 0); // Saat farkını yok say
      const amount = Number(t.amount);
      const isIncome = t.categoryType === 'Income';

      // 1. GÜNLÜK KONTROLÜ
      if (tDate.getTime() === today.getTime()) {
        if (isIncome) daily.income += amount;
        else daily.expense += amount;
      }

      // 2. HAFTALIK KONTROLÜ (Bu haftanın başından bugüne kadar)
      if (tDate >= startOfWeek) {
        if (isIncome) weekly.income += amount;
        else weekly.expense += amount;
      }

      // 3. AYLIK KONTROLÜ (Bu ayın başından bugüne kadar)
      if (tDate >= startOfMonth) {
        if (isIncome) monthly.income += amount;
        else monthly.expense += amount;
      }
    });

    return { daily, weekly, monthly };
  }, [transactionsData]);

  return (
    <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-xl">
      <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Günlük Durum</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard 
                    title="Günlük Gelir" 
                    value={stats.daily.income} 
                    color="green" 
                    isIncreaseGood={true}
                    description="Bugün kazanılan"
                />
                <StatCard 
                    title="Günlük Gider" 
                    value={stats.daily.expense} 
                    color="red" 
                    isIncreaseGood={false}
                    description="Bugün harcanan"
                />
            </div>
        </div>

        {/* --- 2. HAFTALIK İSTATİSTİKLER --- */}
        <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Haftalık Durum (Pzt'den itibaren)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard 
                    title="Haftalık Gelir" 
                    value={stats.weekly.income} 
                    color="green" 
                    isIncreaseGood={true}
                    description="Bu hafta toplamı"
                />
                <StatCard 
                    title="Haftalık Gider" 
                    value={stats.weekly.expense} 
                    color="red" 
                    isIncreaseGood={false}
                    description="Bu hafta toplamı"
                />
            </div>
        </div>

        {/* --- 3. AYLIK İSTATİSTİKLER --- */}
        <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Aylık Durum (Bu Ay)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard 
                    title="Aylık Gelir" 
                    value={stats.monthly.income} 
                    color="green" 
                    isIncreaseGood={true}
                    description="Bu ayın toplamı"
                />
                <StatCard 
                    title="Aylık Gider" 
                    value={stats.monthly.expense} 
                    color="red" 
                    isIncreaseGood={false}
                    description="Bu ayın toplamı"
                />
            </div>
        </div>
      
    </div>
  );
};

export default DashboardStats;