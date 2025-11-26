namespace FinanceApp.Core
{
    public class Category : BaseEntity
    {
        public required string Name { get; set; }
        public required string Type { get; set; }
        public List<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}