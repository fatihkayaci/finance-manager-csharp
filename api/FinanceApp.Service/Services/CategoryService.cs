using FinanceApp.Core;
using FinanceApp.Service.DTOs;
using FinanceApp.DataAccess;
using Microsoft.EntityFrameworkCore;
using FinanceApp.Service.Interfaces;
namespace FinanceApp.Service.Services
{
    // Bu class, ICategoryService sözleşmesindeki kuralları uygulamak (implement) zorundadır.
    public class CategoryService : ICategoryService
    {
        // 1. BAĞLANTIYI TANIMLA (Dependency Injection)
        // Burası çok önemli! DataAccess katmanında yazdığımız "FinanceDbContext"i buraya çağırıyoruz.
        // _context: Bizim veritabanı bağlantı nesnemizdir.
        private readonly FinanceDbContext _context;

        // Constructor (Yapıcı Metot):
        // Uygulama çalışınca, .NET bize otomatik olarak dolu bir FinanceDbContext verir.
        public CategoryService(FinanceDbContext context)
        {
            _context = context; // Gelen bağlantıyı al, içeride kullanmak üzere sakla.
        }

        // 2. METOTLARI DOLDUR
        
        // "Tüm kategorileri getir" dediğimizde çalışacak kod:
        public async Task<List<CategoryDto>> GetAllCategoriesAsync()
        {
            // 1. Veritabanından ham veriyi çek
            var entities = await _context.Categories.ToListAsync();

            // 2. Ham veriyi DTO'ya çevir (Mapping)
            var dtos = new List<CategoryDto>();

            foreach (var item in entities)
            {
                dtos.Add(new CategoryDto
                {
                    Id = item.Id,
                    Name = item.Name,
                    Type = item.Type
                });
            }

            // 3. Temiz listeyi gönder
            return dtos;
        }

        // "Yeni kategori ekle" dediğimizde çalışacak kod:
        public async Task AddCategoryAsync(CreateCategoryDto newCategoryDto)
        {
            // MAPPING: Gelen DTO'yu -> Entity'ye çeviriyoruz
            var categoryEntity = new Category
            {
                Name = newCategoryDto.Name,
                Type = newCategoryDto.Type,
                // ID, CreatedDate vs. otomatik oluşacak
            };

            await _context.Categories.AddAsync(categoryEntity);
            await _context.SaveChangesAsync();
        }
    }
}