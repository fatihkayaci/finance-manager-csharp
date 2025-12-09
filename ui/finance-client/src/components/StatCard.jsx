import React from 'react';

const StatCard = ({ 
  title, 
  value, 
  color = "blue", // 'green', 'red', 'blue'
  percentage, 
  isIncreaseGood = true, // Gelir artarsa iyi (true), Gider artarsa kötü (false)
  description 
}) => {
  
  // Tailwind sınıflarını dinamik oluştururken hata olmaması için map kullanımı
  const borderColors = {
    green: "border-green-500",
    red: "border-red-500",
    blue: "border-blue-500",
  };

  const borderColorClass = borderColors[color] || borderColors.blue;

  // Yüzde rozeti rengini belirleme
  let badgeColorClass = "bg-gray-100 text-gray-700";
  let arrow = "";
  
  if (percentage !== undefined && percentage !== null) {
    const isPositive = percentage >= 0;
    arrow = isPositive ? "↑" : "↓";
    
    if (isIncreaseGood) {
        badgeColorClass = isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
    } else {
        badgeColorClass = percentage <= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
    }
  }

  return (
    <div className={`bg-white p-4 rounded-lg shadow border-l-4 ${borderColorClass} w-full`}>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      
      <div className="mt-2 flex items-baseline gap-2">
        <span className={`text-2xl font-bold ${color === 'blue' ? (parseFloat(value) >= 0 ? 'text-blue-600' : 'text-red-600') : 'text-gray-800'}`}>
            {value} TL
        </span>

        {/* Yüzde değeri varsa göster */}
        {percentage !== undefined && percentage !== null && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeColorClass}`}>
            {arrow} %{Math.abs(percentage).toFixed(1)}
          </span>
        )}
      </div>
      
      {description && (
        <p className="text-xs text-gray-400 mt-1">{description}</p>
      )}
    </div>
  );
};

export default StatCard;