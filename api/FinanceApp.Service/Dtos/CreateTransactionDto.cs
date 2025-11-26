using System.ComponentModel.DataAnnotations; // Zorunlu alan kontrolü için

namespace FinanceApp.Service.DTOs
{
    public class CreateTransactionDto
    {
        [Required]
        public decimal Amount { get; set; } 

        [Required]
        public string? Description { get; set; }

        [Required]
        public DateTime TransactionDate { get; set; }
        
        [Required]
        public int CategoryId { get; set; }
    }
}