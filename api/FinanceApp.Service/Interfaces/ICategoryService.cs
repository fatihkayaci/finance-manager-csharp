using FinanceApp.Service.DTOs;
namespace FinanceApp.Service.Interfaces
{
    public interface ICategoryService
    {
        // Task: Asenkron (Bekletmeyen) işlem demektir.
        Task<List<CategoryDto>> GetAllCategoriesAsync();
        // Yeni bir kategori ekleme metodu.
        Task AddCategoryAsync(CreateCategoryDto newCategory);
    }
}