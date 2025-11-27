using FinanceApp.Core;
using Microsoft.EntityFrameworkCore;

namespace FinanceApp.DataAccess
{
    // DbContext sınıfından miras alarak bu class'a "Sen bir Veritabanı Yöneticisisin" diyoruz.
    public class FinanceDbContext : DbContext
    {
        // 1. YAPICI METOT (Constructor)
        // Dışarıdan (API katmanından) veritabanı ayarlarını (Connection String) alabilmek için bu kapıyı açıyoruz.
        // options: "Hangi veritabanına bağlanacağım?", "Şifrem ne?" gibi bilgileri taşır.
        public FinanceDbContext(DbContextOptions<FinanceDbContext> options) : base(options)
        {
        }

        // 2. TABLO TANIMLARI (DbSet)
        // C# tarafındaki "Category" class'ı, veritabanında "Categories" tablosuna denk gelsin.
        public DbSet<Category> Categories { get; set; }
        
        // C# tarafındaki "Transaction" class'ı, veritabanında "Transactions" tablosuna denk gelsin.
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<User> Users { get; set; }

        // Tablolar oluşurken ekstra kurallar belirlemek istersek burayı kullanırız.
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>()
                .HasMany(c => c.Transactions)
                .WithOne(t => t.Category)
                .HasForeignKey(t => t.CategoryId);

            // Örnek: Transaction silinirse Kategori silinmesin (Restrict)
            // Veya Kategori silinirse içindeki işlemler de silinsin (Cascade)
            // EF Core default olarak Cascade yapar. Şimdilik böyle kalsın.
            
            base.OnModelCreating(modelBuilder);
        }
    }
}