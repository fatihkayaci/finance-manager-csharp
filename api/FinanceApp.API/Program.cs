using FinanceApp.DataAccess;
using FinanceApp.Service.Interfaces;
using FinanceApp.Service.Services;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

// Postgres tarih ayarı
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

// --- 1. CORS AYARI (NÜKLEER MOD) ---
builder.Services.AddCors(options =>
{
    // İsim vermiyoruz, varsayılan politika yapıyoruz.
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()  // KİM OLURSAN OL GEL (localhost, ip, vs.)
              .AllowAnyHeader()  // Her türlü başlığı kabul et
              .AllowAnyMethod(); // GET, POST, PUT, DELETE hepsine izin ver
    });
});

// Veritabanı Bağlantısı
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<FinanceDbContext>(options =>
    options.UseNpgsql(connectionString));

// Servisler
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();

// Controllerlar ve JSON Döngü Engelleyici
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// --- 2. MIDDLEWARE SIRALAMASI (ÇOK ÖNEMLİ) ---

// CORS EN BAŞTA OLMALI!
app.UseCors(); 

// Swagger her zaman açık olsun
app.UseSwagger();
app.UseSwaggerUI();

// app.UseHttpsRedirection(); // Docker için kapalı kalsın

app.UseAuthorization();

app.MapControllers();

// Veritabanı Otomatik Oluşturma (Migration)
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<FinanceDbContext>();
    try 
    {
        context.Database.EnsureCreated();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Veritabani hatasi: {ex.Message}");
    }
}

app.Run();