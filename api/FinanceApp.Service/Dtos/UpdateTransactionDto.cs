using System.ComponentModel.DataAnnotations;

namespace FinanceApp.Service.DTOs
{
    public class UpdateTransactionDto
    {
        [Required]
        public decimal Amount { get; set; }

        public string? Description { get; set; }

        [Required]
        public DateTime TransactionDate { get; set; }

        [Required]
        public int CategoryId { get; set; }
    }
}