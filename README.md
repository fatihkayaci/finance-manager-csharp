# 💰 Finance Manager (Personal Finance Tracker)

> A modern, full-stack personal finance management application built with **.NET 9**, **React**, and **Docker**. Designed with **Clean Architecture** principles.

![Status](https://img.shields.io/badge/Status-v0.2_Alpha-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Net](https://img.shields.io/badge/.NET-9.0-purple)
![React](https://img.shields.io/badge/React-18-cyan)

## 🔗 Live Demo

Check out the live application here: **[Finance Manager Live](https://finance-manager-csharp.vercel.app/)**

## 🚀 Features

- **Transaction Management:** Track income and expenses easily.
- **Dynamic Categorization:** Create categories with specific types (**Income** or **Expense**) and custom colors.
- **Reporting:** (Coming Soon) Visual dashboard for monthly/yearly insights.
- **Containerized:** Fully dockerized environment for easy setup.
- **Secure Authentication:** JWT (JSON Web Token) based login & registration system.

## 🏗️ Architecture & Tech Stack

This project follows the **N-Layer Architecture (Clean Architecture)** to ensure scalability and maintainability.

### Backend (API)

- **Framework:** .NET 9 (Core)
- **Database:** PostgreSQL 15
- **ORM:** Entity Framework Core 9 (Code-First)
- **Validation:** Data Annotations & DTO Validation
- **Documentation:** Swagger / OpenAPI
- **Pattern:** Repository Pattern & DTOs
- **Security:** BCrypt (Password Hashing) & JWT Bearer Authentication

### Frontend (UI)

- **Library:** React.js (Vite)
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **HTTP Client:** Fetch API / Axios
- **State Management:** React Hooks

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

| Service   | URL                                |
|-----------|------------------------------------|
| API (Swagger) | http://localhost:5055/swagger  |
| PgAdmin   | http://localhost:5050              |
| Frontend  | http://localhost:5173              |

## 📂 Project Structure
```
finance-manager-csharp/
├── api/
│   ├── FinanceApp.API/          # Controllers & Entry Point
│   ├── FinanceApp.Core/         # Entities & Interfaces (Domain Layer)
│   ├── FinanceApp.DataAccess/   # EF Core & Database Context
│   └── FinanceApp.Service/      # Business Logic & DTOs
├── database/                    # Database scripts (if needed)
├── ui/                          # React Application
└── docker-compose.yml           # Orchestration
```

## 📝 License

This project is licensed under the MIT License.

---

Developed by **Fatih KAYACI**