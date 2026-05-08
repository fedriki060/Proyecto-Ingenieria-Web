using System.Text;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using SalaFinder.Api.Api.Middleware;
using SalaFinder.Api.Application.Services;
using SalaFinder.Api.Application.Validators;
using SalaFinder.Api.Core.Entities;
using SalaFinder.Api.Core.Interfaces;
using SalaFinder.Api.Infrastructure.Data;
using SalaFinder.Api.Infrastructure.Repositories;
using SalaFinder.Api.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// ─── Base de datos ────────────────────────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ─── Identity ─────────────────────────────────────────────────────────────────
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequiredLength = 8;
    options.Password.RequireDigit = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

// ─── JWT ──────────────────────────────────────────────────────────────────────
var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("Jwt:Key no configurada.");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

builder.Services.AddAuthorization();

// ─── CORS ─────────────────────────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// ─── Repositorios ─────────────────────────────────────────────────────────────
builder.Services.AddScoped<ISalaRepository, SalaRepository>();
builder.Services.AddScoped<IReservaRepository, ReservaRepository>();

// ─── Servicios ────────────────────────────────────────────────────────────────
builder.Services.AddScoped<IAuditService, AuditService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ISalaService, SalaService>();
builder.Services.AddScoped<IReservaService, ReservaService>();

// ─── Validaciones ─────────────────────────────────────────────────────────────
builder.Services.AddScoped<IValidator<RegisterDto>, RegisterValidator>();
builder.Services.AddScoped<IValidator<LoginDto>, LoginValidator>();
builder.Services.AddScoped<IValidator<SalaCreateDto>, SalaCreateValidator>();
builder.Services.AddScoped<IValidator<SalaUpdateDto>, SalaUpdateValidator>();
builder.Services.AddScoped<IValidator<ReservaCreateDto>, ReservaCreateValidator>();
builder.Services.AddScoped<IValidator<CambiarEstadoDto>, CambiarEstadoValidator>();

// ─── Controladores y OpenAPI ──────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseCors("FrontendPolicy");
app.MapOpenApi();
app.MapScalarApiReference(options =>
{
    options.WithTitle("SalaFinder API")
           .WithTheme(ScalarTheme.Purple)
           .WithDefaultHttpClient(ScalarTarget.JavaScript, ScalarClient.Fetch);
});
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// ─── Seed de roles ────────────────────────────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    await SalaFinder.Api.Infrastructure.Migrations.DatabaseSeeder.SeedAsync(scope.ServiceProvider);
}

app.Run();