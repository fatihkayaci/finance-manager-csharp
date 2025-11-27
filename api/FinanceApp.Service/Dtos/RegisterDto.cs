using System.ComponentModel.DataAnnotations;

namespace FinanceApp.Service.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string Username { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required, MinLength(6)] // Şifre en az 6 karakter olsun
        public string Password { get; set; }
    }
}