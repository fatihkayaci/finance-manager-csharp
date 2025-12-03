using FinanceApp.Core;
using FinanceApp.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;
using FinanceApp.Service.DTOs;
using Microsoft.AspNetCore.Authorization;
namespace FinanceApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();
            return Ok(categories);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateCategoryDto newCategory)
        {
            await _categoryService.AddCategoryAsync(newCategory);
            
            return Ok(new { message = "Kategori başarıyla eklendi!" });
        }
    }
}