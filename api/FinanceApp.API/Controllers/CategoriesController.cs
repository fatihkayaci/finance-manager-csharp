using FinanceApp.Core;
using FinanceApp.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;
using FinanceApp.Service.DTOs;
namespace FinanceApp.API.Controllers
{
    [Route("api/[controller]")] // Adresimiz: "api/categories" olacak
    [ApiController]             // Bu class bir API Controller'dır diyoruz
    public class CategoriesController : ControllerBase
    {
        // 1. BAĞLANTI (Dependency Injection)
        // Bize veritabanı değil, "Service" lazım. Veritabanı Service'in sorunu.
        private readonly ICategoryService _categoryService;

        // Program.cs'e diyoruz ki: "Bana ICategoryService ayarla ve gönder."
        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        // 2. ENDPOINTLER (Uç Noktalar)

        // GET: api/categories
        // Tüm kategorileri listeler
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            // Garson (API), Aşçıya (Service) sesleniyor:
            var categories = await _categoryService.GetAllCategoriesAsync();
            
            // Müşteriye tepsiyi sunuyoruz (200 OK ve Liste)
            return Ok(categories);
        }

        // POST: api/categories
        // Yeni kategori ekler
        [HttpPost]
        public async Task<IActionResult> Create(CreateCategoryDto newCategory)
        {
            // Garson, siparişi mutfağa iletiyor:
            await _categoryService.AddCategoryAsync(newCategory);
            
            // Müşteriye "Tamamdır" diyoruz (200 OK)
            return Ok(new { message = "Kategori başarıyla eklendi!" });
        }
    }
}