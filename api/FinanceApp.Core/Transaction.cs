namespace FinanceApp.Core
{
    public class Transaction : BaseEntity
    {
        public decimal Amount { get; set; } 
        public string? Description { get; set; }
        public DateTime TransactionDate { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;
    }
}