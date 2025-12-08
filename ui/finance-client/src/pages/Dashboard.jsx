import SummaryChart from '../components/SummaryChart';

export default function Dashboard( {transactionsData} ) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-xl">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
           <SummaryChart transactions={transactionsData} />
        </div>
      </div>
    </div>
  )
}