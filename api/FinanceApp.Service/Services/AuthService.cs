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
        public async Task<LoginResponseDto> LoginAsync(LoginDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                throw new Exception("Kullanıcı bulunamadı.");
            }

            // 2. Şifreyi Kontrol Et
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new Exception("Şifre yanlış!");
            }

            // 3. Token Üretme İşlemleri (Aynen kalıyor)
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("JwtSettings:SecretKey").Value!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = creds,
                Issuer = _configuration.GetSection("JwtSettings:Issuer").Value,
                Audience = _configuration.GetSection("JwtSettings:Audience").Value
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenObj = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(tokenObj);

            // --- BURASI DEĞİŞTİ ---
            // Sadece string token yerine, dolu bir obje dönüyoruz:
            return new LoginResponseDto
            {
                Token = tokenString,
                UserId = user.Id,
                Username = user.Username,
                Email = user.Email
            };
        }
    }
}