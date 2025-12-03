# 1. AŞAMA: İNŞAAT (Build)
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Proje dosyalarını kopyala
COPY ["FinanceApp.API/FinanceApp.API.csproj", "FinanceApp.API/"]
COPY ["FinanceApp.Core/FinanceApp.Core.csproj", "FinanceApp.Core/"]
COPY ["FinanceApp.DataAccess/FinanceApp.DataAccess.csproj", "FinanceApp.DataAccess/"]
COPY ["FinanceApp.Service/FinanceApp.Service.csproj", "FinanceApp.Service/"]

# Paketleri indir
RUN dotnet restore "FinanceApp.API/FinanceApp.API.csproj"

# Geri kalan her şeyi kopyala
COPY . .
WORKDIR "/src/FinanceApp.API"

# Derle ve Yayınla (Release Modu - En hafifi)
RUN dotnet publish "FinanceApp.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# 2. AŞAMA: ÇALIŞTIRMA (Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Render'ın verdiği portu dinlemesi için (Genelde 8080)
EXPOSE 8080
ENV ASPNETCORE_HTTP_PORTS=8080

# ARTIK "WATCH" YOK, DİREKT DLL ÇALIŞTIRILIYOR
ENTRYPOINT ["dotnet", "FinanceApp.API.dll"]