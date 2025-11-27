namespace FinanceApp.Core
{
    public class User : BaseEntity
    {
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
        
        // Bir kullanıcının birden çok işlemi olabilir (İleride lazım olur)
        // public List<Transaction> Transactions { get; set; } 
    }
}