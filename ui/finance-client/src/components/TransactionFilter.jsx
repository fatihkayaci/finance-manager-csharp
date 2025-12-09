import React from 'react';

const TransactionFilter = ({ 
    searchTerm, setSearchTerm, 
    filterCategory, setFilterCategory, 
    startDate, setStartDate, 
    endDate, setEndDate, 
    categories 
}) => {

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCategory("");
    setStartDate("");
    setEndDate("");
  };

  const hasFilters = searchTerm || filterCategory || startDate || endDate;

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 w-full">
        <h2 className="text-gray-700 font-semibold mb-3">İşlemleri Filtrele</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Arama */}
            <input 
                type="text" 
                placeholder="Açıklama ara..." 
                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            {/* Kategori */}
            <select 
                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 bg-white outline-none"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
            >
                <option value="">Tüm Kategoriler</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>

            {/* Başlangıç Tarihi */}
            <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Başlangıç</span>
                <input 
                    type="date" 
                    className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </div>

            {/* Bitiş Tarihi */}
            <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Bitiş</span>
                <input 
                    type="date" 
                    className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>
        </div>
        
        {hasFilters && (
            <button 
                onClick={clearFilters}
                className="mt-3 text-sm text-red-500 hover:text-red-700 underline"
            >
                Filtreleri Temizle
            </button>
        )}
    </div>
  );
};

export default TransactionFilter;