using FinanceApp.Core; // User nesnesi için
using FinanceApp.Service.DTOs; // DTO'lar için

namespace FinanceApp.Service.Interfaces
{
    public interface IAuthService
    {
        // Kayıt Ol: Başarılıysa User döner, değilse hata fırlatır.
        Task<User> RegisterAsync(RegisterDto request);

        // Giriş Yap: Başarılıysa "Token" (string) döner.
        Task<string> LoginAsync(LoginDto request);
    }
}