# SalaFinder — Sistema de Reserva de Espacios

Proyecto fullstack de reserva de espacios académicos desarrollado para el curso de Ingeniería Web.

## Estructura del repositorio
Proyecto-Ingenieria-Web/
├── src/               → Frontend (React + TypeScript + Vite)
└── SalaFinder.Api/    → Backend (ASP.NET Core Web API)

## Ramas

| Rama | Contenido |
|---|---|
| `master` | Frontend React + integración con API |
| `backend` | Backend ASP.NET Core Web API |

## Frontend

**Stack:** React + TypeScript + Vite + Tailwind CSS

```bash
npm install
npm run dev
```

Corre en `http://localhost:5173`

## Backend

**Stack:** ASP.NET Core + EF Core + Identity + JWT + Scalar

```bash
git checkout backend
cd SalaFinder.Api
dotnet ef database update
dotnet run
```

Documentación API en `http://localhost:5070/scalar/v1`

## Usuarios de prueba

| Email | Contraseña | Rol |
|---|---|---|
| admin@salafinder.com | Admin123! | Admin |
| juan@uni.com | Estudiante123! | Estudiante |
| staff1@salafinder.com | Staff123! | Staff |
