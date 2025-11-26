namespace FinanceApp.Service.DTOs
{
    // Bu sınıf sadece veri taşımak içindir. Veritabanı ile işi yoktur.
    public class CategoryDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Type { get; set; }
        // Bak "Transactions" listesini koymadık. Döngü bitti! ✂️
    }
}