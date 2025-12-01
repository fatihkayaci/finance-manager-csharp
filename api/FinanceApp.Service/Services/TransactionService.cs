using System.Security.Claims; // Token okumak için gerekli
using FinanceApp.Core;
using FinanceApp.DataAccess;
using FinanceApp.Service.DTOs;
using FinanceApp.Service.Interfaces;
using Microsoft.AspNetCore.Http; // HttpContext için gerekli
using Microsoft.EntityFrameworkCore;

namespace FinanceApp.Service.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly FinanceDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor; // <-- YENİ: Kimlik Okuyucu

        public TransactionService(FinanceDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        // --- YARDIMCI METOT: Şu anki kullanıcının ID'sini bulur ---
        private int GetCurrentUserId()
        {
            // Token'ın içindeki "NameIdentifier" (biz oraya ID koymuştuk) verisini okur.
            var userIdString = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userIdString))
                throw new Exception("Kullanıcı bulunamadı! Giriş yaptınız mı?");

            return int.Parse(userIdString);
        }

        public async Task<List<TransactionDto>> GetAllTransactionsAsync()
        {
            var currentUserId = GetCurrentUserId(); // Kim istiyor?

            var transactions = await _context.Transactions
                                             .Include(t => t.Category)
                                             .Where(t => t.UserId == currentUserId) // <-- FİLTRE: Sadece benimkileri getir!
                                             .OrderByDescending(t => t.TransactionDate)
                                             .ToListAsync();

            // (Mapping kısmı aynı kalıyor)
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
            var currentUserId = GetCurrentUserId(); // Kim ekliyor?

            var transactionEntity = new Transaction
            {
                Amount = transactionDto.Amount,
                Description = transactionDto.Description,
                TransactionDate = transactionDto.TransactionDate,
                CategoryId = transactionDto.CategoryId,
                UserId = currentUserId // <-- DAMGALAMA: Bu işlem bu kişinindir.
            };

            await _context.Transactions.AddAsync(transactionEntity);
            await _context.SaveChangesAsync();
        }
    }
}