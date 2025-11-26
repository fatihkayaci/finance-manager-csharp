using FinanceApp.Core;
using FinanceApp.Service.Interfaces; // Interface nerede?
using Microsoft.AspNetCore.Mvc;
using FinanceApp.Service.DTOs;

namespace FinanceApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionsController : ControllerBase
    {
        private readonly ITransactionService _transactionService;

        // Constructor'da ITransactionService istiyoruz (Program.cs verecek)
        public TransactionsController(ITransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _transactionService.GetAllTransactionsAsync();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateTransactionDto transaction)
        {
            // Basit bir validasyon (İleride FluentValidation ile yapacağız)
            if (transaction.Amount == 0)
                return BadRequest("Tutar 0 olamaz!");

            await _transactionService.AddTransactionAsync(transaction);
            return Ok(new { message = "İşlem başarıyla kaydedildi." });
        }
    }
}