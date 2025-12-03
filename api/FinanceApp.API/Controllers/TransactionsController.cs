using FinanceApp.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;
using FinanceApp.Service.DTOs;
using Microsoft.AspNetCore.Authorization;
namespace FinanceApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TransactionsController : ControllerBase
    {
        private readonly ITransactionService _transactionService;

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
            if (transaction.Amount == 0)
                return BadRequest("Tutar 0 olamaz!");

            await _transactionService.AddTransactionAsync(transaction);
            return Ok(new { message = "İşlem başarıyla kaydedildi." });
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try 
            {
                await _transactionService.DeleteTransactionAsync(id);
                return Ok(new { message = "Silindi" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateTransactionDto transaction)
        {
            try
            {
                await _transactionService.UpdateTransactionAsync(id, transaction);
                return Ok(new { message = "İşlem başarıyla güncellendi." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}