using FinanceApp.DataAccess;
using FinanceApp.Service.Interfaces;
using FinanceApp.Service.Services;
using Microsoft.EntityFrameworkCore;

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
var builder = WebApplication.CreateBuilder(args);

// 1. SERVİSLERİ EKLEME

// Veritabanı Bağlantısı
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<FinanceDbContext>(options =>
    options.UseNpgsql(connectionString));

// Bizim Servisler (Dependency Injection)
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();

// Controllerlar
builder.Services.AddControllers();

// Swagger (API Dokümantasyonu) Servisleri
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 2. UYGULAMA AYARLARI (Middleware)

// --- KRİTİK DEĞİŞİKLİK BURADA ---
// "if (Development)" kontrolünü kaldırdık. Swagger hep açık olsun.
app.UseSwagger();
app.UseSwaggerUI();
// --------------------------------

// HTTPS yönlendirmesini kapattık (Docker'da bazen 404 yapar)
// app.UseHttpsRedirection(); 

app.UseAuthorization();

app.MapControllers();

// Veritabanını otomatik oluştur (Migration)
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<FinanceDbContext>();
    // Hata almamak için try-catch bloğuna aldık
    try 
    {
        context.Database.EnsureCreated();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Veritabani olusturulurken hata: {ex.Message}");
    }
}

app.Run();