# 💰 Finance Manager (Personal Finance Tracker)

> A modern, full-stack personal finance management application built with **.NET 9**, **React**, and **Docker**. Designed with **Clean Architecture** principles.

![Work In Progress](https://img.shields.io/badge/Status-Work_In_Progress-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🚀 Features

- **Transaction Management:** Track income and expenses easily.
- **Categorization:** Organize transactions with custom categories.
- **Reporting:** (Coming Soon) Visual dashboard for monthly/yearly insights.
- **Containerized:** Fully dockerized environment for easy setup.

## 🏗️ Architecture & Tech Stack

This project follows the **N-Layer Architecture (Clean Architecture)** to ensure scalability and maintainability.

### Backend (API)

- **Framework:** .NET 9 (Core)
- **Database:** PostgreSQL 15
- **ORM:** Entity Framework Core 9 (Code-First)
- **Validation:** FluentValidation (Planned)
- **Documentation:** Swagger / OpenAPI
- **Pattern:** Repository Pattern & DTOs

### Frontend (UI)

*[In Progress]*

- **Library:** React.js
- **State Management:** (Planned)
- **Styling:** (Planned)

### DevOps

- **Docker & Docker Compose:** For orchestration of API, Database, and UI.
- **PgAdmin:** Database management tool included.

## 🛠️ Getting Started

You don't need to install .NET or PostgreSQL on your local machine. Just have **Docker** installed.

### 1. Clone the repository
```bash
git clone https://github.com/fatihkayaci/finance-manager-csharp
cd finance-manager-csharp
```

### 2. Run with Docker Compose

This command will spin up the Database, API, and Admin Panel.
```bash
docker-compose up --build
```

### 3. Access the Application

- **API (Swagger):** http://localhost:5055/swagger
- **PgAdmin:** http://localhost:5050
- **Frontend:** (Coming Soon)

## 📂 Project Structure
```
finance-manager-csharp/
├── api/
│   ├── FinanceApp.API/          # Controllers & Entry Point
│   ├── FinanceApp.Core/         # Entities & Interfaces (Domain Layer)
│   ├── FinanceApp.DataAccess/   # EF Core & Database Context
│   └── FinanceApp.Service/      # Business Logic & DTOs
├── database/                    # Database scripts (if needed)
├── ui/                          # React Application (Coming Soon)
└── docker-compose.yml           # Orchestration
```

## 📝 License

This project is licensed under the MIT License.

---

**Developed by Fatih KAYACI**