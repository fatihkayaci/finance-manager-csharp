namespace FinanceApp.Service.DTOs
{
    public class TransactionDto
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public string? Description { get; set; }
        public DateTime TransactionDate { get; set; }
        
        // Frontend'in işini kolaylaştıralım:
        public int CategoryId { get; set; }
        public required string CategoryName { get; set; } // Kategori adını da içine gömelim!
    }
}