using FinanceApp.Core;
using FinanceApp.DataAccess;
using FinanceApp.Service.Interfaces; // Interface'i bulması için
using Microsoft.EntityFrameworkCore;
using FinanceApp.Service.DTOs;
namespace FinanceApp.Service.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly FinanceDbContext _context;

        public TransactionService(FinanceDbContext context)
        {
            _context = context;
        }

        public async Task<List<TransactionDto>> GetAllTransactionsAsync()
        {
            var transactions = await _context.Transactions
                                             .Include(t => t.Category) // Kategoriyi de getir (JOIN)
                                             .OrderByDescending(t => t.TransactionDate) // En yeniler üstte olsun
                                             .ToListAsync();

            var transactionDtos = new List<TransactionDto>();
            foreach (var t in transactions)
            {
                transactionDtos.Add(new TransactionDto
                {
                    Id = t.Id,
                    Amount = t.Amount,
                    Description = t.Description,
                    TransactionDate = t.TransactionDate,
                    CategoryId = t.CategoryId,
                    CategoryName = t.Category.Name,
                    CategoryType = t.Category.Type
                });
            }

            return transactionDtos;
        }

        public async Task AddTransactionAsync(CreateTransactionDto transactionDto)
        {
            var transactionEntity = new Transaction
            {
                Amount = transactionDto.Amount,
                Description = transactionDto.Description,
                TransactionDate = transactionDto.TransactionDate,
                CategoryId = transactionDto.CategoryId
            };

            await _context.Transactions.AddAsync(transactionEntity);
            await _context.SaveChangesAsync();
        }
    }
}