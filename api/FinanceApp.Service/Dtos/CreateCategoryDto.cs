using System.ComponentModel.DataAnnotations; // Zorunlu alan kontrolü için

namespace FinanceApp.Service.DTOs
{
    public class CreateCategoryDto
    {
        // Swagger'da kullanıcının boş geçmesini engellemek için [Required] ekleyebiliriz.
        [Required]
        public required string Name { get; set; }

        [Required]
        public required string Type { get; set; }
    }
}