using FinanceApp.Core;
using FinanceApp.DataAccess;
using FinanceApp.Service.DTOs;
using FinanceApp.Service.Interfaces;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net; // Şifreleme kütüphanesi
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration; // Ayarları okumak için
using Microsoft.IdentityModel.Tokens;

namespace FinanceApp.Service.Services
{
    public class AuthService : IAuthService
    {
        private readonly FinanceDbContext _context;
        private readonly IConfiguration _configuration;
        public AuthService(FinanceDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // --- KAYIT OLMA ---
        public async Task<User> RegisterAsync(RegisterDto request)
        {
            // 1. Bu e-posta zaten var mı?
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                throw new Exception("Bu e-posta adresi zaten kayıtlı!");
            }

            // 2. Şifreyi Hashle (Kriptola)
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            // 3. Kullanıcıyı Oluştur
            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = passwordHash
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return user;
        }

        // --- GİRİŞ YAPMA ---
        public async Task<string> LoginAsync(LoginDto request)
        {
            // 1. Kullanıcıyı bul
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                throw new Exception("Kullanıcı bulunamadı.");
            }

            // 2. Şifreyi Kontrol Et (Verify)
            // Gelen şifreyi (1234) al, Hashle ve veritabanındaki Hash ile kıyasla.
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new Exception("Şifre yanlış!");
            }

            // 3. Token Üret (Burayı bir sonraki adımda dolduracağız)
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new Exception("Şifre yanlış!");
            }

            // --- 3. TOKEN ÜRETME (YENİ KISIM) ---
            
            // A) Token'ın içine gömeceğimiz bilgiler (Claims)
            // Bu bilgiler bilekliğin üzerinde yazan yazılardır.
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), // Kullanıcı ID'si
                new Claim(ClaimTypes.Name, user.Username),                // Kullanıcı Adı
                new Claim(ClaimTypes.Email, user.Email)                   // E-posta
            };

            // B) Gizli Anahtarı Getir
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("JwtSettings:SecretKey").Value!));

            // C) İmzalama Şekli (Mühürleme)
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            // D) Token'ı Oluştur
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(1), // Token 1 gün geçerli olsun
                SigningCredentials = creds,
                Issuer = _configuration.GetSection("JwtSettings:Issuer").Value,
                Audience = _configuration.GetSection("JwtSettings:Audience").Value
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            // E) Token'ı string olarak döndür (eyJhbGciOiJIUz...)
            return tokenHandler.WriteToken(token);
        }
    }
}