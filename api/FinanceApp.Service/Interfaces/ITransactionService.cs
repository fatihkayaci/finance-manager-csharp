using FinanceApp.Core;
using FinanceApp.Service.DTOs;
namespace FinanceApp.Service.Interfaces // Klasör yapına uygun Namespace
{
    public interface ITransactionService
    {
        // Tüm işlemleri getir (İleride tarih filtresi ekleyeceğiz buraya)
        Task<List<TransactionDto>> GetAllTransactionsAsync();

        // Yeni işlem ekle (Para girişi/çıkışı)
        Task AddTransactionAsync(CreateTransactionDto newTransaction);
    }
}