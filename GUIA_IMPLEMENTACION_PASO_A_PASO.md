# GUÍA DE IMPLEMENTACIÓN PASO A PASO
## Prueba Técnica Angular Senior - To-Do List App

Esta guía te llevará día por día a través de la implementación completa del proyecto.

---

## DÍA 1: CONFIGURACIÓN Y AUTENTICACIÓN

### Parte 1: Setup del Backend (.NET 9)

#### 1.1. Crear la estructura del proyecto

```bash
# Crear carpeta raíz
mkdir TodoApp.Backend
cd TodoApp.Backend

# Crear solución
dotnet new sln -n TodoApp

# Crear proyectos
dotnet new webapi -n TodoApp.API
dotnet new classlib -n TodoApp.Application
dotnet new classlib -n TodoApp.Domain
dotnet new classlib -n TodoApp.Infrastructure
dotnet new xunit -n TodoApp.Tests

# Agregar proyectos a la solución
dotnet sln add TodoApp.API/TodoApp.API.csproj
dotnet sln add TodoApp.Application/TodoApp.Application.csproj
dotnet sln add TodoApp.Domain/TodoApp.Domain.csproj
dotnet sln add TodoApp.Infrastructure/TodoApp.Infrastructure.csproj
dotnet sln add TodoApp.Tests/TodoApp.Tests.csproj

# Configurar referencias entre proyectos
dotnet add TodoApp.API/TodoApp.API.csproj reference TodoApp.Application/TodoApp.Application.csproj
dotnet add TodoApp.Application/TodoApp.Application.csproj reference TodoApp.Domain/TodoApp.Domain.csproj
dotnet add TodoApp.Infrastructure/TodoApp.Infrastructure.csproj reference TodoApp.Domain/TodoApp.Domain.csproj
dotnet add TodoApp.API/TodoApp.API.csproj reference TodoApp.Infrastructure/TodoApp.Infrastructure.csproj
dotnet add TodoApp.Tests/TodoApp.Tests.csproj reference TodoApp.API/TodoApp.API.csproj
dotnet add TodoApp.Tests/TodoApp.Tests.csproj reference TodoApp.Application/TodoApp.Application.csproj
```

#### 1.2. Instalar paquetes NuGet

```bash
# TodoApp.API
cd TodoApp.API
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Swashbuckle.AspNetCore
dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Sinks.Console
dotnet add package Serilog.Sinks.File

# TodoApp.Application
cd ../TodoApp.Application
dotnet add package FluentValidation.AspNetCore
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection

# TodoApp.Infrastructure
cd ../TodoApp.Infrastructure
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.InMemory
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package BCrypt.Net-Next

# TodoApp.Tests
cd ../TodoApp.Tests
dotnet add package Moq
dotnet add package FluentAssertions
dotnet add package Microsoft.EntityFrameworkCore.InMemory

cd ..
```

#### 1.3. Crear entidades del Domain

**TodoApp.Domain/Common/BaseEntity.cs**:
```csharp
namespace TodoApp.Domain.Common;

public abstract class BaseEntity
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
```

**TodoApp.Domain/Entities/User.cs**:
```csharp
using TodoApp.Domain.Common;

namespace TodoApp.Domain.Entities;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
}
```

**TodoApp.Domain/Entities/TaskEntity.cs**:
```csharp
using TodoApp.Domain.Common;

namespace TodoApp.Domain.Entities;

public class TaskEntity : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsCompleted { get; set; } = false;
    public int UserId { get; set; }
    public User User { get; set; } = null!;
}
```

**TodoApp.Domain/Interfaces/IUserRepository.cs**:
```csharp
using TodoApp.Domain.Entities;

namespace TodoApp.Domain.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByIdAsync(int id);
    Task<User> AddAsync(User user);
}
```

**TodoApp.Domain/Interfaces/ITaskRepository.cs**:
```csharp
using TodoApp.Domain.Entities;

namespace TodoApp.Domain.Interfaces;

public interface ITaskRepository
{
    Task<IEnumerable<TaskEntity>> GetAllByUserIdAsync(int userId, bool? isCompleted = null);
    Task<TaskEntity?> GetByIdAsync(int id);
    Task<TaskEntity> AddAsync(TaskEntity task);
    Task UpdateAsync(TaskEntity task);
    Task DeleteAsync(int id);
    Task<int> CountByUserIdAsync(int userId);
    Task<int> CountCompletedByUserIdAsync(int userId);
    Task<int> CountPendingByUserIdAsync(int userId);
}
```

#### 1.4. Configurar Infrastructure (EF Core)

**TodoApp.Infrastructure/Data/ApplicationDbContext.cs**:
```csharp
using Microsoft.EntityFrameworkCore;
using TodoApp.Domain.Entities;

namespace TodoApp.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<TaskEntity> Tasks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Email).HasMaxLength(256).IsRequired();
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.FirstName).HasMaxLength(100);
            entity.Property(e => e.LastName).HasMaxLength(100);
        });

        // TaskEntity configuration
        modelBuilder.Entity<TaskEntity>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.IsCompleted).IsRequired();

            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Seed data
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                Email = "admin@todoapp.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                FirstName = "Admin",
                LastName = "User",
                CreatedAt = DateTime.UtcNow
            }
        );
    }
}
```

**TodoApp.Infrastructure/Repositories/UserRepository.cs**:
```csharp
using Microsoft.EntityFrameworkCore;
using TodoApp.Domain.Entities;
using TodoApp.Domain.Interfaces;
using TodoApp.Infrastructure.Data;

namespace TodoApp.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task<User> AddAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }
}
```

**TodoApp.Infrastructure/Repositories/TaskRepository.cs**:
```csharp
using Microsoft.EntityFrameworkCore;
using TodoApp.Domain.Entities;
using TodoApp.Domain.Interfaces;
using TodoApp.Infrastructure.Data;

namespace TodoApp.Infrastructure.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly ApplicationDbContext _context;

    public TaskRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TaskEntity>> GetAllByUserIdAsync(int userId, bool? isCompleted = null)
    {
        var query = _context.Tasks.Where(t => t.UserId == userId);

        if (isCompleted.HasValue)
        {
            query = query.Where(t => t.IsCompleted == isCompleted.Value);
        }

        return await query.OrderByDescending(t => t.CreatedAt).ToListAsync();
    }

    public async Task<TaskEntity?> GetByIdAsync(int id)
    {
        return await _context.Tasks.FindAsync(id);
    }

    public async Task<TaskEntity> AddAsync(TaskEntity task)
    {
        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();
        return task;
    }

    public async Task UpdateAsync(TaskEntity task)
    {
        task.UpdatedAt = DateTime.UtcNow;
        _context.Tasks.Update(task);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task != null)
        {
            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<int> CountByUserIdAsync(int userId)
    {
        return await _context.Tasks.CountAsync(t => t.UserId == userId);
    }

    public async Task<int> CountCompletedByUserIdAsync(int userId)
    {
        return await _context.Tasks.CountAsync(t => t.UserId == userId && t.IsCompleted);
    }

    public async Task<int> CountPendingByUserIdAsync(int userId)
    {
        return await _context.Tasks.CountAsync(t => t.UserId == userId && !t.IsCompleted);
    }
}
```

#### 1.5. Crear DTOs y servicios de Application

**TodoApp.Application/DTOs/Auth/LoginRequestDto.cs**:
```csharp
namespace TodoApp.Application.DTOs.Auth;

public class LoginRequestDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
```

**TodoApp.Application/DTOs/Auth/LoginResponseDto.cs**:
```csharp
namespace TodoApp.Application.DTOs.Auth;

public class LoginResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
}
```

**TodoApp.Application/Configuration/JwtSettings.cs**:
```csharp
namespace TodoApp.Application.Configuration;

public class JwtSettings
{
    public string Secret { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public int ExpirationInHours { get; set; } = 24;
}
```

**TodoApp.Application/Interfaces/IAuthService.cs**:
```csharp
using TodoApp.Application.DTOs.Auth;

namespace TodoApp.Application.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginRequestDto request);
}
```

**TodoApp.Application/Services/AuthService.cs**:
```csharp
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using TodoApp.Application.Configuration;
using TodoApp.Application.DTOs.Auth;
using TodoApp.Application.Interfaces;
using TodoApp.Domain.Interfaces;

namespace TodoApp.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly JwtSettings _jwtSettings;

    public AuthService(IUserRepository userRepository, IOptions<JwtSettings> jwtSettings)
    {
        _userRepository = userRepository;
        _jwtSettings = jwtSettings.Value;
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return null;
        }

        var token = GenerateJwtToken(user.Id, user.Email);

        return new LoginResponseDto
        {
            Token = token,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName
        };
    }

    private string GenerateJwtToken(int userId, string email)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Email, email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(_jwtSettings.ExpirationInHours),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
```

**TodoApp.Application/Validators/LoginRequestValidator.cs**:
```csharp
using FluentValidation;
using TodoApp.Application.DTOs.Auth;

namespace TodoApp.Application.Validators;

public class LoginRequestValidator : AbstractValidator<LoginRequestDto>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("El email es requerido")
            .EmailAddress().WithMessage("El email no es válido");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("La contraseña es requerida")
            .MinimumLength(6).WithMessage("La contraseña debe tener al menos 6 caracteres");
    }
}
```

#### 1.6. Configurar el API

**TodoApp.API/appsettings.json**:
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=TodoAppDb;Trusted_Connection=True;TrustServerCertificate=True"
  },
  "JwtSettings": {
    "Secret": "SuperSecretKeyThatIsAtLeast32CharactersLong!",
    "Issuer": "TodoApp",
    "Audience": "TodoAppUsers",
    "ExpirationInHours": 24
  }
}
```

**TodoApp.API/Program.cs**:
```csharp
using System.Text;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using TodoApp.Application.Configuration;
using TodoApp.Application.Interfaces;
using TodoApp.Application.Services;
using TodoApp.Application.Validators;
using TodoApp.Domain.Interfaces;
using TodoApp.Infrastructure.Data;
using TodoApp.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Serilog configuration
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Swagger with JWT support
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "TodoApp API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// JWT Configuration
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
builder.Services.Configure<JwtSettings>(jwtSettings);

var key = Encoding.UTF8.GetBytes(jwtSettings.Get<JwtSettings>()!.Secret);
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
        ValidIssuer = jwtSettings.Get<JwtSettings>()!.Issuer,
        ValidAudience = jwtSettings.Get<JwtSettings>()!.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

// FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<LoginRequestValidator>();

// Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITaskRepository, TaskRepository>();

// Services
builder.Services.AddScoped<IAuthService, AuthService>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAngularApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
```

**TodoApp.API/Controllers/AuthController.cs**:
```csharp
using Microsoft.AspNetCore.Mvc;
using TodoApp.Application.DTOs.Auth;
using TodoApp.Application.Interfaces;

namespace TodoApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        try
        {
            var result = await _authService.LoginAsync(request);

            if (result == null)
            {
                return Unauthorized(new { message = "Email o contraseña incorrectos" });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }
}
```

#### 1.7. Crear y aplicar migración

```bash
cd TodoApp.API

# Crear migración
dotnet ef migrations add InitialCreate --project ../TodoApp.Infrastructure --startup-project .

# Aplicar migración
dotnet ef database update --project ../TodoApp.Infrastructure --startup-project .

# Ejecutar la API
dotnet run
```

Ahora puedes probar en Swagger: https://localhost:5001/swagger

---

### Parte 2: Setup del Frontend (Angular 18)

#### 2.1. Crear proyecto Angular

```bash
# Navegar a la carpeta raíz (fuera de TodoApp.Backend)
cd ..

# Crear proyecto Angular
ng new todo-app-frontend --routing --style=scss --strict

cd todo-app-frontend
```

#### 2.2. Instalar dependencias

```bash
# NgRx
ng add @ngrx/store@latest
ng add @ngrx/effects@latest
ng add @ngrx/entity@latest
ng add @ngrx/store-devtools@latest

# Angular Material
ng add @angular/material

# Seleccionar:
# - Theme: Indigo/Pink o el que prefieras
# - Global typography: Yes
# - Animations: Yes

# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init

# Otras dependencias
npm install jwt-decode
```

#### 2.3. Configurar Tailwind CSS

**tailwind.config.js**:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**src/styles.scss**:
```scss
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

@import '@angular/material/prebuilt-themes/indigo-pink.css';

html, body { height: 100%; }
body { margin: 0; font-family: Roboto, "Helvetica Neue", sans-serif; }
```

#### 2.4. Configurar estructura de carpetas

```bash
# Core module
ng g module core
ng g service core/services/auth
ng g guard core/guards/auth
ng g interceptor core/interceptors/auth
ng g interceptor core/interceptors/error

# Shared module
ng g module shared

# Feature modules
ng g module features/auth --routing
ng g component features/auth/login

ng g module features/dashboard --routing
ng g component features/dashboard/dashboard

ng g module features/tasks --routing
ng g component features/tasks/task-list
ng g component features/tasks/task-form
ng g component features/tasks/task-filter
ng g service features/tasks/services/task
```

#### 2.5. Configurar environments

**src/environments/environment.ts**:
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001/api'
};
```

**src/environments/environment.development.ts**:
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001/api'
};
```

#### 2.6. Crear modelos e interfaces

**src/app/core/models/user.model.ts**:
```typescript
export interface User {
  email: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
}
```

**src/app/core/models/task.model.ts**:
```typescript
export interface Task {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
}

export interface UpdateTaskDto {
  title: string;
  description?: string;
  isCompleted: boolean;
}

export type FilterType = 'all' | 'completed' | 'pending';
```

#### 2.7. Implementar AuthService

**src/app/core/services/auth.service.ts**:
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());

  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, request)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          const user: User = {
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName
          };
          this.setUser(user);
          this.currentUserSubject.next(user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Check if token is expired (optional)
    return true;
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }
}
```

#### 2.8. Implementar AuthInterceptor

**src/app/core/interceptors/auth.interceptor.ts**:
```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
```

#### 2.9. Implementar ErrorInterceptor

**src/app/core/interceptors/error.interceptor.ts**:
```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError(error => {
      let errorMessage = 'Ocurrió un error inesperado';

      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.status === 401) {
        errorMessage = 'No autorizado. Por favor inicia sesión nuevamente.';
        router.navigate(['/login']);
      } else if (error.status === 403) {
        errorMessage = 'No tienes permisos para realizar esta acción.';
      } else if (error.status === 404) {
        errorMessage = 'Recurso no encontrado.';
      } else if (error.status === 500) {
        errorMessage = 'Error del servidor. Intenta más tarde.';
      }

      snackBar.open(errorMessage, 'Cerrar', {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });

      return throwError(() => error);
    })
  );
};
```

#### 2.10. Implementar AuthGuard

**src/app/core/guards/auth.guard.ts**:
```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
```

#### 2.11. Implementar componente de Login

**src/app/features/auth/login/login.component.ts**:
```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['admin@todoapp.com', [Validators.required, Validators.email]],
      password: ['Admin123!', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.snackBar.open('¡Inicio de sesión exitoso!', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/tasks']);
      },
      error: () => {
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
```

**src/app/features/auth/login/login.component.html**:
```html
<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        To-Do List App
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Inicia sesión para gestionar tus tareas
      </p>
    </div>

    <mat-card>
      <mat-card-content>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <mat-form-field class="w-full" appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" placeholder="tu@email.com">
            <mat-icon matPrefix>email</mat-icon>
            <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
              El email es requerido
            </mat-error>
            <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
              Email inválido
            </mat-error>
          </mat-form-field>

          <mat-form-field class="w-full" appearance="outline">
            <mat-label>Contraseña</mat-label>
            <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
            <mat-icon matPrefix>lock</mat-icon>
            <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
              <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
            <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
              La contraseña es requerida
            </mat-error>
            <mat-error *ngIf="loginForm.get('password')?.hasError('minlength')">
              Mínimo 6 caracteres
            </mat-error>
          </mat-form-field>

          <button
            mat-raised-button
            color="primary"
            type="submit"
            class="w-full"
            [disabled]="loginForm.invalid || isLoading">
            <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
            <span *ngIf="!isLoading">Iniciar Sesión</span>
          </button>
        </form>

        <div class="mt-4 text-center text-sm text-gray-600">
          <p>Credenciales de prueba:</p>
          <p>Email: admin@todoapp.com</p>
          <p>Password: Admin123!</p>
        </div>
      </mat-card-content>
    </mat-card>
  </div>
</div>
```

#### 2.12. Configurar módulos

**src/app/features/auth/auth.module.ts**:
```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ]
})
export class AuthModule { }
```

#### 2.13. Configurar rutas principales

**src/app/app.routes.ts**:
```typescript
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'tasks',
    loadChildren: () => import('./features/tasks/tasks.module').then(m => m.TasksModule),
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
```

#### 2.14. Configurar app.config.ts

**src/app/app.config.ts**:
```typescript
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])
    ),
    provideAnimations(),
    provideStore(),
    provideEffects(),
    provideStoreDevtools({ maxAge: 25 })
  ]
};
```

#### 2.15. Ejecutar la aplicación

```bash
ng serve
```

Navega a http://localhost:4200 y prueba el login.

---

## RESUMEN DEL DÍA 1

Has completado:
- ✅ Backend con Clean Architecture
- ✅ Entity Framework Core con SQL Server
- ✅ JWT Authentication
- ✅ Swagger documentation
- ✅ Frontend con Angular 18
- ✅ Autenticación funcionando end-to-end
- ✅ Interceptores (auth, error)
- ✅ AuthGuard para proteger rutas
- ✅ Angular Material + Tailwind configurados

**Mañana (Día 2)**: Implementarás el CRUD de tareas con NgRx y el dashboard con métricas.

---

# ¿NECESITAS EL DÍA 2 AHORA?

Avísame y continúo con la guía detallada del Día 2 (CRUD de tareas con NgRx).
