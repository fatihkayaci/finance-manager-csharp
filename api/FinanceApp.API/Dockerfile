# Sadece SDK imajını kullanıyoruz (İçinde dotnet watch gibi aletler var)
FROM mcr.microsoft.com/dotnet/sdk:9.0

WORKDIR /app

# Proje dosyalarını kopyala
COPY ["FinanceApp.API/FinanceApp.API.csproj", "FinanceApp.API/"]
COPY ["FinanceApp.Core/FinanceApp.Core.csproj", "FinanceApp.Core/"]
COPY ["FinanceApp.DataAccess/FinanceApp.DataAccess.csproj", "FinanceApp.DataAccess/"]
COPY ["FinanceApp.Service/FinanceApp.Service.csproj", "FinanceApp.Service/"]

# Paketleri indir
RUN dotnet restore "FinanceApp.API/FinanceApp.API.csproj"

# Geri kalan her şeyi kopyala (Volume olsa bile ilk kurulum için bu iyidir)
COPY . .

# Çalışma klasörünü API projesinin içi yap
WORKDIR /app/FinanceApp.API

# HOT RELOAD KOMUTU:
# "watch": Dosyaları izle.
# "run": Çalıştır.
# "--non-interactive": Soru sorup durma.
# "--urls": Dışarıya bu porttan yayın yap.
CMD ["dotnet", "watch", "run", "--non-interactive", "--urls", "http://0.0.0.0:8080"]