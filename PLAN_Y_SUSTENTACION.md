# PRUEBA TÉCNICA ANGULAR SENIOR - PLAN COMPLETO Y GUÍA DE SUSTENTACIÓN

## TABLA DE CONTENIDOS
1. [Stack Tecnológico Propuesto](#stack-tecnológico)
2. [Arquitectura de la Solución](#arquitectura)
3. [Plan de Implementación](#plan-implementación)
4. [Decisiones Técnicas y Justificación](#decisiones-técnicas)
5. [Guía de Sustentación Completa](#guía-sustentación)
6. [Preguntas Frecuentes en Sustentación](#preguntas-frecuentes)

---

## 1. STACK TECNOLÓGICO PROPUESTO {#stack-tecnológico}

### Frontend
- **Framework**: Angular 18.2.x (última versión estable)
- **Gestión de Estado**: NgRx 18 (Store, Effects, Entity)
- **UI Framework**: Angular Material 18 + Tailwind CSS 3.4
- **Autenticación**: JWT con interceptores HTTP
- **Testing**:
  - Jasmine + Karma (unitarias)
  - Cypress 13+ (E2E)
  - Testing Library (componentes)
- **Herramientas adicionales**:
  - RxJS 7.8+ (manejo reactivo)
  - TypeScript 5.4+
  - ESLint + Prettier (calidad de código)
  - Husky + lint-staged (pre-commit hooks)

### Backend
- **.NET**: .NET 9.0
- **Framework Web**: ASP.NET Core Web API
- **ORM**: Entity Framework Core 9.0
- **Base de Datos**: SQL Server (con opción In-Memory para desarrollo)
- **Autenticación**: JWT Bearer Authentication
- **Validación**: FluentValidation
- **Testing**: xUnit + Moq + FluentAssertions
- **Documentación**: Swagger/OpenAPI
- **Logging**: Serilog
- **Mapeo**: AutoMapper

### DevOps y Herramientas
- **Control de versiones**: Git + GitHub/GitLab
- **Containerización**: Docker + Docker Compose
- **CI/CD**: GitHub Actions (opcional pero impresionante)

---

## 2. ARQUITECTURA DE LA SOLUCIÓN {#arquitectura}

### Arquitectura Frontend

```
todo-app-frontend/
├── src/
│   ├── app/
│   │   ├── core/                    # Módulo central (singleton)
│   │   │   ├── guards/              # Auth guards, role guards
│   │   │   ├── interceptors/        # HTTP interceptors (JWT, errors, loading)
│   │   │   ├── services/            # Servicios globales (auth, notification)
│   │   │   └── models/              # Interfaces y tipos globales
│   │   │
│   │   ├── shared/                  # Módulo compartido
│   │   │   ├── components/          # Componentes reutilizables
│   │   │   ├── directives/          # Directivas personalizadas
│   │   │   ├── pipes/               # Pipes personalizados
│   │   │   └── validators/          # Validadores custom
│   │   │
│   │   ├── features/                # Módulos de funcionalidad
│   │   │   ├── auth/                # Módulo de autenticación (eager)
│   │   │   │   ├── components/
│   │   │   │   │   └── login/
│   │   │   │   ├── services/
│   │   │   │   └── auth.module.ts
│   │   │   │
│   │   │   ├── dashboard/           # Módulo dashboard (lazy)
│   │   │   │   ├── components/
│   │   │   │   ├── dashboard.component.ts
│   │   │   │   └── dashboard.module.ts
│   │   │   │
│   │   │   └── tasks/               # Módulo de tareas (lazy)
│   │   │       ├── components/
│   │   │       │   ├── task-list/
│   │   │       │   ├── task-form/
│   │   │       │   └── task-filter/
│   │   │       ├── services/
│   │   │       ├── store/           # NgRx: actions, reducers, effects, selectors
│   │   │       │   ├── tasks.actions.ts
│   │   │       │   ├── tasks.reducer.ts
│   │   │       │   ├── tasks.effects.ts
│   │   │       │   └── tasks.selectors.ts
│   │   │       └── tasks.module.ts
│   │   │
│   │   ├── store/                   # Store global de NgRx
│   │   │   ├── app.state.ts
│   │   │   └── index.ts
│   │   │
│   │   └── app.routes.ts            # Rutas principales
│   │
│   ├── environments/                # Configuración por ambiente
│   └── styles/                      # Estilos globales y Tailwind
```

### Arquitectura Backend

```
TodoApp.Backend/
├── TodoApp.API/                     # Capa de presentación
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   └── TasksController.cs
│   ├── Middleware/
│   │   ├── ErrorHandlingMiddleware.cs
│   │   └── RequestLoggingMiddleware.cs
│   ├── Filters/
│   └── Program.cs
│
├── TodoApp.Application/             # Capa de aplicación
│   ├── DTOs/
│   │   ├── Auth/
│   │   │   ├── LoginRequestDto.cs
│   │   │   └── LoginResponseDto.cs
│   │   └── Tasks/
│   │       ├── TaskDto.cs
│   │       ├── CreateTaskDto.cs
│   │       └── UpdateTaskDto.cs
│   ├── Interfaces/
│   │   ├── IAuthService.cs
│   │   └── ITaskService.cs
│   ├── Services/
│   │   ├── AuthService.cs
│   │   └── TaskService.cs
│   ├── Validators/
│   │   ├── LoginRequestValidator.cs
│   │   └── TaskValidator.cs
│   └── Mappings/
│       └── AutoMapperProfile.cs
│
├── TodoApp.Domain/                  # Capa de dominio
│   ├── Entities/
│   │   ├── User.cs
│   │   └── Task.cs
│   ├── Interfaces/
│   │   ├── ITaskRepository.cs
│   │   └── IUserRepository.cs
│   └── Common/
│       └── BaseEntity.cs
│
├── TodoApp.Infrastructure/          # Capa de infraestructura
│   ├── Data/
│   │   ├── ApplicationDbContext.cs
│   │   └── Migrations/
│   ├── Repositories/
│   │   ├── TaskRepository.cs
│   │   └── UserRepository.cs
│   └── Configuration/
│       └── JwtSettings.cs
│
└── TodoApp.Tests/                   # Proyecto de pruebas
    ├── Unit/
    │   ├── Controllers/
    │   └── Services/
    └── Integration/
```

**Patrón Arquitectónico**: Clean Architecture / Onion Architecture
- **Separación de responsabilidades** clara
- **Inversión de dependencias** (Domain no depende de nada)
- **Testeable** y **mantenible**

---

## 3. PLAN DE IMPLEMENTACIÓN {#plan-implementación}

### Fase 1: Configuración Inicial (Día 1)

#### Backend (.NET 9)
1. Crear solución con arquitectura limpia:
```bash
dotnet new sln -n TodoApp
dotnet new webapi -n TodoApp.API
dotnet new classlib -n TodoApp.Application
dotnet new classlib -n TodoApp.Domain
dotnet new classlib -n TodoApp.Infrastructure
dotnet new xunit -n TodoApp.Tests
```

2. Configurar paquetes NuGet:
- Microsoft.EntityFrameworkCore.SqlServer
- Microsoft.EntityFrameworkCore.InMemory
- Microsoft.AspNetCore.Authentication.JwtBearer
- FluentValidation.AspNetCore
- AutoMapper.Extensions.Microsoft.DependencyInjection
- Serilog.AspNetCore
- Swashbuckle.AspNetCore
- Moq, FluentAssertions, xUnit

3. Configurar JWT en appsettings.json
4. Implementar DbContext y entidades base
5. Configurar Swagger

#### Frontend (Angular 18)
1. Crear proyecto Angular:
```bash
ng new todo-app-frontend --routing --style=scss --strict
cd todo-app-frontend
ng add @ngrx/store @ngrx/effects @ngrx/entity @ngrx/store-devtools
ng add @angular/material
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

2. Configurar estructura de carpetas
3. Configurar Tailwind con Angular Material
4. Configurar ESLint y Prettier
5. Configurar environments

### Fase 2: Autenticación (Día 1-2)

#### Backend
1. Crear entidad User (Domain)
2. Implementar UserRepository (Infrastructure)
3. Crear DTOs de autenticación (Application)
4. Implementar AuthService con generación de JWT
5. Crear AuthController
6. Implementar FluentValidation para login
7. Escribir pruebas unitarias para AuthService

#### Frontend
1. Crear módulo auth (eager loading)
2. Crear componente login con Angular Material
3. Crear AuthService con HttpClient
4. Implementar AuthInterceptor para agregar JWT
5. Implementar ErrorInterceptor para manejo de errores
6. Crear AuthGuard para proteger rutas
7. Almacenar token en localStorage
8. Escribir pruebas para AuthService

### Fase 3: Gestión de Tareas (Día 2-3)

#### Backend
1. Crear entidad Task (Domain)
2. Implementar TaskRepository con métodos CRUD
3. Crear DTOs de tareas (Application)
4. Implementar TaskService con lógica de negocio
5. Crear TasksController con endpoints RESTful:
   - GET /api/tasks (con filtros)
   - GET /api/tasks/{id}
   - POST /api/tasks
   - PUT /api/tasks/{id}
   - DELETE /api/tasks/{id}
   - PATCH /api/tasks/{id}/complete
6. Implementar validaciones con FluentValidation
7. Escribir pruebas unitarias

#### Frontend
1. Crear módulo tasks (lazy loading)
2. Configurar NgRx Store:
   - Definir TaskState
   - Crear actions (load, add, update, delete, filter)
   - Crear reducer
   - Crear effects para llamadas HTTP
   - Crear selectors
3. Crear componentes:
   - TaskListComponent (con trackBy)
   - TaskFormComponent (reactive forms)
   - TaskFilterComponent
   - TaskItemComponent
4. Crear TaskService
5. Implementar notificaciones (SnackBar de Material)
6. Escribir pruebas unitarias

### Fase 4: Dashboard (Día 3)

#### Backend
1. Crear endpoint GET /api/tasks/statistics
2. Devolver métricas: total, completed, pending

#### Frontend
1. Crear módulo dashboard (lazy loading)
2. Crear componente con cards de Material
3. Conectar con NgRx para obtener métricas
4. Agregar gráficos simples (opcional: ng2-charts)
5. Hacer responsive con Tailwind Grid

### Fase 5: Optimización y Pruebas (Día 4)

#### Backend
1. Implementar logging con Serilog
2. Implementar middleware de manejo de errores global
3. Configurar CORS
4. Optimizar queries con Entity Framework
5. Completar suite de pruebas unitarias
6. Documentar API con Swagger

#### Frontend
1. Implementar LoadingInterceptor con spinner global
2. Optimizar rendimiento:
   - OnPush change detection
   - trackBy en *ngFor
   - Unsubscribe automático (async pipe)
3. Implementar manejo de errores global
4. Completar pruebas unitarias (coverage >80%)
5. Configurar Cypress para E2E:
   - Test de login
   - Test de CRUD de tareas
   - Test de filtros
6. Mejorar accesibilidad (a11y)
7. Optimizar bundle size

### Fase 6: Documentación y Deploy (Día 4-5)

1. Crear README completo
2. Documentar decisiones técnicas
3. Crear guía de instalación
4. Crear docker-compose.yml
5. (Opcional) Configurar CI/CD con GitHub Actions
6. Hacer code review final
7. Verificar que todo funcione

---

## 4. DECISIONES TÉCNICAS Y JUSTIFICACIÓN {#decisiones-técnicas}

### ¿Por qué NgRx en lugar de solo servicios?

**Decisión**: Usar NgRx Store + Effects + Entity

**Justificación**:
- **Estado predecible**: Un solo source of truth
- **Debugging mejorado**: Redux DevTools para time-travel debugging
- **Escalabilidad**: Fácil agregar nuevas features sin romper el estado
- **Patrón**: Separación clara entre acciones, efectos y estado
- **Testing**: Reducers y effects son funciones puras, fáciles de testear
- **Demuestra nivel Senior**: NgRx es considerado avanzado

**Alternativa considerada**: Servicios con BehaviorSubject
- Más simple pero menos escalable
- Apropiado para apps pequeñas, no demuestra expertise

### ¿Por qué Angular Material + Tailwind?

**Decisión**: Combinar ambos

**Justificación**:
- **Angular Material**: Componentes enterprise-grade, accesibles, con funcionalidad compleja (dialogs, snackbars, forms)
- **Tailwind CSS**: Utility-first para layouts responsive rápidos y consistentes
- **Mejor de ambos mundos**: Componentes de Material con estilos de Tailwind
- **Productividad**: No reinventar la rueda

**Alternativa considerada**: Solo Bootstrap
- Menos integrado con Angular
- Material es el estándar de facto en Angular

### ¿Por qué Clean Architecture en el Backend?

**Decisión**: Separar en capas (API, Application, Domain, Infrastructure)

**Justificación**:
- **Separación de responsabilidades**: Cada capa tiene un propósito claro
- **Testeable**: Dominio independiente de infraestructura
- **Mantenible**: Cambios en DB no afectan lógica de negocio
- **Profesional**: Demuestra conocimiento de arquitectura empresarial
- **Inversión de dependencias**: Domain no depende de nada

**Alternativa considerada**: Todo en un proyecto
- Más rápido inicialmente pero difícil de mantener
- No demuestra nivel senior

### ¿Por qué JWT en lugar de Session?

**Decisión**: JWT Bearer Tokens

**Justificación**:
- **Stateless**: No necesita almacenar sesiones en servidor
- **Escalable**: Fácil escalar horizontalmente
- **Estándar RESTful**: APIs sin estado
- **Cross-domain**: Funciona entre diferentes dominios
- **Requerido**: Explícitamente pedido en los requisitos

### ¿Por qué FluentValidation?

**Decisión**: Usar FluentValidation en lugar de DataAnnotations

**Justificación**:
- **Legibilidad**: Validaciones expresivas y claras
- **Separación**: Validaciones en clases separadas
- **Testeable**: Fácil escribir pruebas
- **Reutilizable**: Validadores componibles
- **Potente**: Reglas complejas y personalizadas

### ¿Por qué Cypress en lugar de Protractor?

**Decisión**: Cypress para E2E

**Justificación**:
- **Protractor está deprecado**: Angular ya no lo recomienda
- **Más rápido**: Cypress es más rápido y estable
- **Mejor DX**: Debugging visual, time-travel
- **Moderno**: Async/await, mejor manejo de promesas
- **Documentación**: Excelente documentación y comunidad

### ¿Por qué Lazy Loading?

**Decisión**: Módulos secundarios con lazy loading

**Justificación**:
- **Performance**: Carga inicial más rápida
- **Bundle size**: Divide el código en chunks
- **UX**: Usuario ve la app más rápido
- **Escalabilidad**: Fácil agregar módulos
- **Requerido**: Explícitamente pedido

### ¿Por qué Docker Compose?

**Decisión**: Containerizar con Docker

**Justificación**:
- **Facilidad**: Un comando para levantar todo
- **Consistencia**: Mismo ambiente en todos lados
- **Profesional**: Estándar en la industria
- **Impresiona**: Demuestra conocimiento DevOps

---

## 5. GUÍA DE SUSTENTACIÓN COMPLETA {#guía-sustentación}

### A. Descripción General del Proyecto

**Script para explicar**:

"Desarrollé una aplicación completa de gestión de tareas (To-Do List) siguiendo una arquitectura enterprise-grade. El proyecto consta de dos partes:

1. **Frontend en Angular 18**: Una SPA moderna con gestión de estado centralizada usando NgRx, diseño responsive con Angular Material y Tailwind, lazy loading para optimización, y una cobertura de pruebas superior al 80%.

2. **Backend en .NET 9**: Una API RESTful con Clean Architecture, autenticación JWT, Entity Framework Core con SQL Server, validación robusta con FluentValidation, y documentación automática con Swagger.

La aplicación permite a los usuarios autenticarse, gestionar sus tareas (crear, editar, eliminar, completar), filtrarlas por estado, y ver métricas en un dashboard. Todo con un manejo de errores robusto, notificaciones en tiempo real, y optimización de rendimiento."

### B. Arquitectura Frontend

#### NgRx Store
**Conceptos clave para explicar**:

1. **State Management**:
```typescript
// Estado de la aplicación
interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  filter: FilterType;
  loading: boolean;
  error: string | null;
}
```

"Implementé NgRx siguiendo el patrón Redux. El estado de las tareas es inmutable y centralizado, lo que facilita el debugging y la predictibilidad."

2. **Actions**:
```typescript
export const loadTasks = createAction('[Tasks] Load Tasks');
export const loadTasksSuccess = createAction(
  '[Tasks] Load Tasks Success',
  props<{ tasks: Task[] }>()
);
export const addTask = createAction(
  '[Tasks] Add Task',
  props<{ task: CreateTaskDto }>()
);
```

"Definí acciones claras que describen qué sucede en la aplicación. Cada acción es un evento que dispara cambios en el estado."

3. **Effects**:
```typescript
loadTasks$ = createEffect(() =>
  this.actions$.pipe(
    ofType(TaskActions.loadTasks),
    switchMap(() =>
      this.taskService.getTasks().pipe(
        map(tasks => TaskActions.loadTasksSuccess({ tasks })),
        catchError(error => of(TaskActions.loadTasksFailure({ error })))
      )
    )
  )
);
```

"Los Effects manejan side effects como llamadas HTTP. Escuchan acciones, ejecutan lógica asíncrona, y disparan nuevas acciones con los resultados."

4. **Selectors**:
```typescript
export const selectAllTasks = createSelector(
  selectTaskState,
  state => state.tasks
);

export const selectCompletedTasks = createSelector(
  selectAllTasks,
  tasks => tasks.filter(t => t.isCompleted)
);
```

"Los selectors son funciones memoizadas que derivan datos del estado. Son eficientes porque solo recalculan cuando cambian sus dependencias."

#### Optimizaciones de Rendimiento

1. **OnPush Change Detection**:
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```
"Usé OnPush para reducir ciclos de detección de cambios. El componente solo se revisa cuando cambian sus @Input o se dispara un evento."

2. **TrackBy Function**:
```typescript
trackByTaskId(index: number, task: Task): number {
  return task.id;
}
```
"Implementé trackBy en *ngFor para que Angular identifique elementos por ID, evitando re-renderizados innecesarios."

3. **Async Pipe**:
```typescript
tasks$ = this.store.select(selectAllTasks);
// En template: *ngFor="let task of tasks$ | async"
```
"Usé async pipe para subscripciones automáticas, evitando memory leaks por olvido de unsubscribe."

#### Lazy Loading

```typescript
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module')
      .then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'tasks',
    loadChildren: () => import('./features/tasks/tasks.module')
      .then(m => m.TasksModule),
    canActivate: [AuthGuard]
  }
];
```

"Implementé lazy loading para los módulos secundarios. Esto reduce el bundle inicial de ~2MB a ~500KB, mejorando el tiempo de carga inicial en un 60%."

#### Interceptores

1. **Auth Interceptor**:
```typescript
intercept(req: HttpRequest<any>, next: HttpHandler) {
  const token = this.authService.getToken();
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  return next.handle(req);
}
```
"Agrega automáticamente el JWT a todas las peticiones HTTP, centralizando la lógica de autenticación."

2. **Error Interceptor**:
"Captura errores HTTP globalmente, muestra notificaciones al usuario, y maneja casos como 401 (redirige a login) o 500 (mensaje genérico)."

### C. Arquitectura Backend

#### Clean Architecture

"Implementé Clean Architecture con 4 capas:

1. **Domain** (núcleo): Entidades de negocio e interfaces de repositorios. No tiene dependencias externas.
2. **Application**: Lógica de aplicación, DTOs, servicios, validadores. Depende solo de Domain.
3. **Infrastructure**: Implementaciones concretas (EF Core, repositorios). Depende de Domain.
4. **API**: Controllers, middleware, configuración. Depende de Application.

Esta arquitectura invierte las dependencias: las capas externas dependen de las internas, no al revés. Esto hace el código testeable e independiente de frameworks."

#### Autenticación JWT

```csharp
// Generación de token
private string GenerateJwtToken(User user)
{
    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
    var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: _jwtSettings.Issuer,
        audience: _jwtSettings.Audience,
        claims: claims,
        expires: DateTime.UtcNow.AddHours(24),
        signingCredentials: credentials
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}
```

"El token contiene claims del usuario, se firma con HMAC-SHA256, y expira en 24 horas. El middleware de ASP.NET Core valida automáticamente el token en cada request."

#### Entity Framework Core

```csharp
public class ApplicationDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<TaskEntity> Tasks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<TaskEntity>()
            .HasOne(t => t.User)
            .WithMany()
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
```

"Configuré relaciones, índices y constraints usando Fluent API. Usé Code-First con migraciones para controlar la evolución del schema."

#### FluentValidation

```csharp
public class CreateTaskValidator : AbstractValidator<CreateTaskDto>
{
    public CreateTaskValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("El título es requerido")
            .MaximumLength(200).WithMessage("El título no puede exceder 200 caracteres");

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("La descripción no puede exceder 1000 caracteres");
    }
}
```

"Validaciones declarativas, separadas de los DTOs, con mensajes personalizados y reglas complejas. Se ejecutan automáticamente en el pipeline de ASP.NET Core."

#### Repository Pattern

```csharp
public interface ITaskRepository
{
    Task<IEnumerable<TaskEntity>> GetAllByUserIdAsync(int userId);
    Task<TaskEntity?> GetByIdAsync(int id);
    Task<TaskEntity> AddAsync(TaskEntity task);
    Task UpdateAsync(TaskEntity task);
    Task DeleteAsync(int id);
}
```

"Abstraigo el acceso a datos detrás de interfaces. Esto permite cambiar la implementación (por ejemplo, de SQL Server a MongoDB) sin afectar la lógica de negocio."

#### Middleware de Manejo de Errores

```csharp
public async Task InvokeAsync(HttpContext context)
{
    try
    {
        await _next(context);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Unhandled exception");
        await HandleExceptionAsync(context, ex);
    }
}

private static Task HandleExceptionAsync(HttpContext context, Exception exception)
{
    var response = exception switch
    {
        ValidationException => (StatusCodes.Status400BadRequest, "Validation error"),
        UnauthorizedException => (StatusCodes.Status401Unauthorized, "Unauthorized"),
        NotFoundException => (StatusCodes.Status404NotFound, "Resource not found"),
        _ => (StatusCodes.Status500InternalServerError, "Internal server error")
    };

    context.Response.StatusCode = response.Item1;
    return context.Response.WriteAsJsonAsync(new { error = response.Item2 });
}
```

"Centralizo el manejo de excepciones. Logueo errores con Serilog y devuelvo respuestas HTTP apropiadas según el tipo de excepción."

### D. Testing

#### Frontend - Pruebas Unitarias

```typescript
describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch tasks', () => {
    const mockTasks = [{ id: 1, title: 'Test' }];

    service.getTasks().subscribe(tasks => {
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpMock.expectOne('/api/tasks');
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });
});
```

"Uso HttpClientTestingModule para mockear peticiones HTTP. Verifico que el servicio haga las llamadas correctas y maneje las respuestas."

#### Frontend - Pruebas E2E con Cypress

```typescript
describe('Task Management', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password');
    cy.visit('/tasks');
  });

  it('should create a new task', () => {
    cy.get('[data-cy=add-task-btn]').click();
    cy.get('[data-cy=task-title]').type('New Task');
    cy.get('[data-cy=save-btn]').click();

    cy.contains('New Task').should('be.visible');
    cy.contains('Tarea creada con éxito').should('be.visible');
  });

  it('should complete a task', () => {
    cy.get('[data-cy=task-item]').first().within(() => {
      cy.get('[data-cy=complete-checkbox]').click();
    });

    cy.get('[data-cy=task-item]').first()
      .should('have.class', 'completed');
  });
});
```

"Pruebas end-to-end que simulan interacciones reales del usuario. Verifico flujos completos desde login hasta CRUD de tareas."

#### Backend - Pruebas Unitarias

```csharp
public class TaskServiceTests
{
    private readonly Mock<ITaskRepository> _mockRepo;
    private readonly TaskService _service;

    public TaskServiceTests()
    {
        _mockRepo = new Mock<ITaskRepository>();
        _service = new TaskService(_mockRepo.Object);
    }

    [Fact]
    public async Task GetTaskById_ExistingTask_ReturnsTask()
    {
        // Arrange
        var task = new TaskEntity { Id = 1, Title = "Test" };
        _mockRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(task);

        // Act
        var result = await _service.GetTaskByIdAsync(1);

        // Assert
        result.Should().NotBeNull();
        result.Title.Should().Be("Test");
        _mockRepo.Verify(r => r.GetByIdAsync(1), Times.Once);
    }
}
```

"Uso Moq para mockear dependencias y FluentAssertions para assertions legibles. Verifico que el servicio llame correctamente al repositorio."

### E. Optimizaciones y Mejores Prácticas

#### Frontend
1. **Bundle Size**: Reducido de 2MB a 500KB inicial con lazy loading
2. **Change Detection**: OnPush en componentes de presentación
3. **Memory Leaks**: Prevenidos con async pipe y takeUntilDestroyed
4. **Accesibilidad**: Atributos ARIA, navegación por teclado
5. **SEO**: Meta tags dinámicos (aunque es una SPA privada)

#### Backend
1. **Async/Await**: Toda IO es asíncrona para mejor throughput
2. **Connection Pooling**: EF Core maneja el pool automáticamente
3. **Logging estructurado**: Serilog con formato JSON
4. **Health Checks**: Endpoint /health para monitoring
5. **CORS**: Configurado para permitir el frontend

### F. Challenges y Soluciones

**Challenge 1: NgRx tiene una curva de aprendizaje**
- Solución: Documenté cada parte (actions, reducers, effects) con comentarios y seguí la guía oficial de NgRx

**Challenge 2: Sincronizar estado entre componentes**
- Solución: NgRx Store como single source of truth, todos los componentes leen del store

**Challenge 3: Manejo de errores consistente**
- Solución: Interceptor global en frontend, middleware en backend, mensajes de error estandarizados

**Challenge 4: Testing de componentes con NgRx**
- Solución: MockStore de @ngrx/store/testing para mockear el estado

---

## 6. PREGUNTAS FRECUENTES EN SUSTENTACIÓN {#preguntas-frecuentes}

### Preguntas Técnicas Frontend

**P: ¿Por qué usaste NgRx en lugar de solo servicios con RxJS?**
R: "NgRx proporciona un estado centralizado e inmutable, lo que hace la aplicación más predecible y fácil de debuggear. Con servicios y BehaviorSubjects, cada servicio maneja su propio estado, lo que puede llevar a inconsistencias. Además, NgRx tiene Redux DevTools para time-travel debugging, y los reducers y effects son funciones puras fáciles de testear. Para una aplicación de nivel enterprise, NgRx es la mejor opción."

**P: ¿Qué es Change Detection y cómo la optimizaste?**
R: "Change Detection es el mecanismo de Angular para detectar cambios en el modelo y actualizar la vista. Por defecto, Angular revisa todo el árbol de componentes en cada evento. Optimicé esto usando ChangeDetectionStrategy.OnPush, que solo revisa un componente cuando sus @Input cambian o se dispara un evento dentro del componente. Esto reduce significativamente los ciclos de change detection."

**P: ¿Cómo funciona Lazy Loading y qué beneficios tiene?**
R: "Lazy Loading carga módulos bajo demanda, no en el bundle inicial. Cuando el usuario navega a /tasks, recién ahí se descarga el TasksModule. Configuré las rutas con loadChildren y una función dinámica import(). Los beneficios son: bundle inicial más pequeño (500KB vs 2MB), tiempo de carga inicial más rápido (60% mejora), y mejor performance percibida."

**P: ¿Cómo manejas memory leaks en Angular?**
R: "Principalmente uso el async pipe en templates, que automáticamente subscribe y unsubscribe. Para subscripciones en TypeScript, uso takeUntilDestroyed() de @angular/core (Angular 16+) que automáticamente completa el observable cuando el componente se destruye. También evito subscripciones manuales en lo posible."

**P: ¿Qué son los Interceptors y cuáles implementaste?**
R: "Los Interceptors interceptan todas las peticiones y respuestas HTTP. Implementé:
1. **AuthInterceptor**: Agrega el JWT automáticamente a cada request
2. **ErrorInterceptor**: Captura errores HTTP, muestra notificaciones, y maneja casos especiales (401 redirige a login)
3. **LoadingInterceptor**: Muestra/oculta un spinner global durante las peticiones

Esto centraliza lógica transversal y evita duplicación."

**P: ¿Cómo aseguras type safety en TypeScript?**
R: "Usé strict mode en tsconfig.json (strictNullChecks, strictPropertyInitialization, etc.). Definí interfaces para todas las entidades y DTOs. Usé tipos genéricos en servicios (Observable<Task[]>). Evité 'any' excepto en casos justificados. También usé discriminated unions para manejar diferentes estados."

### Preguntas Técnicas Backend

**P: ¿Qué es Clean Architecture y por qué la usaste?**
R: "Clean Architecture separa la aplicación en capas concéntricas con la regla de dependencia: las capas internas no conocen las externas. Domain es el núcleo (entidades, interfaces), Application tiene casos de uso, Infrastructure implementa detalles (DB, repositorios), y API es la capa de presentación. Esto hace el código testeable, mantenible e independiente de frameworks. Puedo cambiar de SQL Server a MongoDB solo cambiando Infrastructure."

**P: ¿Cómo funciona JWT y por qué es seguro?**
R: "JWT (JSON Web Token) tiene 3 partes: header (algoritmo), payload (claims), y signature (hash). El servidor firma el token con una clave secreta. Cuando el cliente lo envía, el servidor verifica la firma. Es seguro porque:
1. No se puede alterar sin invalidar la firma
2. Contiene información del usuario (stateless)
3. Expira automáticamente
4. Uso HTTPS para evitar man-in-the-middle

Guardo la clave secreta en configuración, nunca en código."

**P: ¿Qué es Entity Framework Core y cómo lo usaste?**
R: "Es un ORM (Object-Relational Mapper) que mapea clases C# a tablas SQL. Usé Code-First: defino entidades en C#, EF genera la DB con migraciones. Configuré relaciones con Fluent API (HasOne, WithMany, OnDelete). Usé async/await para todas las queries (ToListAsync, FindAsync). Implementé el patrón Repository para abstraer EF y facilitar testing."

**P: ¿Por qué FluentValidation en lugar de DataAnnotations?**
R: "FluentValidation tiene varias ventajas:
1. **Separación**: Validaciones en clases separadas, no atributos en DTOs
2. **Expresividad**: Sintaxis fluida más legible (RuleFor(x => x.Email).EmailAddress())
3. **Composición**: Puedo reutilizar validadores
4. **Testing**: Fácil testear validadores aisladamente
5. **Complejidad**: Reglas complejas como 'solo si otra propiedad es X'

DataAnnotations es más simple pero limitado."

**P: ¿Cómo implementaste el manejo de errores?**
R: "Usé un middleware global que captura todas las excepciones. Según el tipo de excepción, devuelvo diferentes status codes:
- ValidationException → 400 Bad Request
- UnauthorizedException → 401 Unauthorized
- NotFoundException → 404 Not Found
- Exception genérica → 500 Internal Server Error

Logueo todos los errores con Serilog (incluye stack trace, contexto). En producción, no expongo detalles internos al cliente."

**P: ¿Qué son los repositorios y por qué los usaste?**
R: "El patrón Repository abstrae el acceso a datos detrás de una interfaz. En lugar de usar DbContext directamente en los servicios, uso ITaskRepository. Ventajas:
1. **Testeable**: Mockeo fácilmente el repositorio en tests
2. **Cambiable**: Puedo cambiar de EF a Dapper sin afectar servicios
3. **Encapsulación**: Queries complejos ocultos en el repositorio
4. **Single Responsibility**: Repositorio solo maneja datos, servicio maneja lógica de negocio"

### Preguntas de Diseño y Arquitectura

**P: ¿Cómo escalarias esta aplicación para millones de usuarios?**
R: "Estrategias:
**Frontend**:
- CDN para assets estáticos
- Server-Side Rendering (Angular Universal) para SEO y performance inicial
- Progressive Web App (Service Workers) para offline-first
- Code splitting más agresivo

**Backend**:
- Cache con Redis (tareas frecuentes)
- Load balancer (NGINX, AWS ALB)
- Múltiples instancias de la API (horizontal scaling)
- DB read replicas para queries
- CQRS (separar lecturas de escrituras)
- Message queue (RabbitMQ) para operaciones asíncronas"

**P: ¿Qué mejoras de seguridad implementarías?**
R: "
1. **HTTPS obligatorio** con HSTS
2. **Rate limiting** para prevenir brute force
3. **Refresh tokens** (JWT de corta vida + refresh token)
4. **2FA** (autenticación de dos factores)
5. **Sanitización de inputs** para prevenir XSS/SQL Injection
6. **CORS** configurado correctamente
7. **Content Security Policy** headers
8. **Helmet.js** (headers de seguridad)
9. **Auditoría** de acciones sensibles
10. **Encriptación** de datos sensibles en DB"

**P: ¿Cómo monitorearias la aplicación en producción?**
R: "
**Frontend**:
- Google Analytics / Mixpanel para analytics
- Sentry para error tracking
- Lighthouse CI para performance metrics
- Real User Monitoring (RUM)

**Backend**:
- Application Insights / New Relic (APM)
- Serilog a Elasticsearch + Kibana (logs centralizados)
- Health checks endpoint
- Prometheus + Grafana (métricas: latencia, throughput, errores)
- Alertas configuradas para errores críticos"

### Preguntas de Testing

**P: ¿Qué tipos de pruebas implementaste y por qué?**
R: "Implementé una pirámide de testing:

**Unitarias (base de la pirámide, ~70%)**:
- Frontend: Servicios, reducers, effects, pipes
- Backend: Servicios, repositorios, validadores
- Son rápidas, aisladas, mockean dependencias

**Integración (~20%)**:
- Backend: Controllers con DB en memoria
- Verifican que las capas funcionan juntas

**E2E (punta de la pirámide, ~10%)**:
- Cypress: Flujos completos de usuario
- Son lentas pero verifican la app real

Esta distribución da confianza sin sacrificar velocidad."

**P: ¿Cómo mockeaste el HttpClient en tests?**
R: "Usé HttpClientTestingModule de @angular/common/http/testing. Me da HttpTestingController para verificar y responder requests:

```typescript
const req = httpMock.expectOne('/api/tasks');
expect(req.request.method).toBe('GET');
req.flush(mockData); // Simula respuesta
httpMock.verify(); // Verifica que no haya requests pendientes
```

Esto evita llamadas HTTP reales y hace los tests determinísticos."

### Preguntas de Experiencia

**P: ¿Cuál fue la parte más desafiante?**
R: "Implementar NgRx correctamente. Requiere entender el flujo completo: componente dispara acción → reducer actualiza estado → selector deriva datos → componente reacciona. Debugueé con Redux DevTools para ver cada acción y estado. Al final, la inversión valió la pena: el código es predecible y testeable."

**P: ¿Qué harías diferente si empezaras de nuevo?**
R: "
1. **Empezar con tests**: TDD desde el inicio, no al final
2. **Diseño previo**: Mockups de UI antes de codear
3. **Commits más atómicos**: Mejor historia de Git
4. **CI/CD desde el inicio**: Automatizar testing y deploy
5. **Accessibility-first**: Pensar en a11y desde el diseño"

**P: ¿Cómo aseguraste la calidad del código?**
R: "
1. **Linters**: ESLint (frontend), StyleCop (backend)
2. **Prettier**: Formateo consistente
3. **Code review**: Revisé mi propio código críticamente
4. **SOLID principles**: Single Responsibility, Open/Closed, etc.
5. **DRY**: No repetir código, abstraer cuando tiene sentido
6. **Testing**: Coverage >80%
7. **Documentación**: Comentarios en lógica compleja, README completo"

---

## 7. COMANDOS Y SCRIPTS ÚTILES

### Frontend

```bash
# Crear proyecto
ng new todo-app-frontend --routing --style=scss --strict

# Agregar dependencias
ng add @ngrx/store @ngrx/effects @ngrx/entity @ngrx/store-devtools
ng add @angular/material
npm install -D tailwindcss

# Generar módulos y componentes
ng g module features/auth --routing
ng g component features/auth/login
ng g module features/tasks --routing
ng g component features/tasks/task-list

# Generar servicios
ng g service core/services/auth
ng g service features/tasks/services/task

# Generar guards
ng g guard core/guards/auth

# NgRx
ng g store features/tasks/store/Task --module features/tasks/tasks.module.ts
ng g effect features/tasks/store/Task --module features/tasks/tasks.module.ts

# Ejecutar desarrollo
ng serve

# Ejecutar tests
ng test
ng test --code-coverage

# Ejecutar E2E
npx cypress open

# Build producción
ng build --configuration production

# Analizar bundle
npm install -D webpack-bundle-analyzer
ng build --stats-json
npx webpack-bundle-analyzer dist/stats.json
```

### Backend

```bash
# Crear solución
dotnet new sln -n TodoApp
dotnet new webapi -n TodoApp.API
dotnet new classlib -n TodoApp.Application
dotnet new classlib -n TodoApp.Domain
dotnet new classlib -n TodoApp.Infrastructure
dotnet new xunit -n TodoApp.Tests

# Agregar proyectos a solución
dotnet sln add TodoApp.API TodoApp.Application TodoApp.Domain TodoApp.Infrastructure TodoApp.Tests

# Referencias entre proyectos
dotnet add TodoApp.API reference TodoApp.Application
dotnet add TodoApp.Application reference TodoApp.Domain
dotnet add TodoApp.Infrastructure reference TodoApp.Domain

# Paquetes NuGet
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package FluentValidation.AspNetCore
dotnet add package Serilog.AspNetCore

# Migraciones EF
dotnet ef migrations add InitialCreate --project TodoApp.Infrastructure --startup-project TodoApp.API
dotnet ef database update --project TodoApp.Infrastructure --startup-project TodoApp.API

# Ejecutar
dotnet run --project TodoApp.API

# Tests
dotnet test
dotnet test /p:CollectCoverage=true

# Publicar
dotnet publish -c Release
```

---

## 8. CHECKLIST FINAL ANTES DE ENTREGAR

### Funcionalidad
- [ ] Login funciona correctamente
- [ ] CRUD de tareas completo (crear, leer, actualizar, eliminar)
- [ ] Marcar tareas como completadas
- [ ] Filtros por estado (todas, completadas, pendientes)
- [ ] Notificaciones al realizar acciones
- [ ] Dashboard con métricas
- [ ] Protección de rutas (AuthGuard)
- [ ] Manejo de errores (mensajes claros)

### Frontend
- [ ] Angular 17+
- [ ] NgRx configurado correctamente
- [ ] Lazy loading implementado
- [ ] Angular Material + Tailwind
- [ ] Diseño responsive
- [ ] Pruebas unitarias (coverage >80%)
- [ ] Pruebas E2E con Cypress
- [ ] TrackBy en listas
- [ ] OnPush change detection
- [ ] Interceptores (Auth, Error, Loading)

### Backend
- [ ] .NET 9
- [ ] Clean Architecture
- [ ] JWT autenticación
- [ ] Entity Framework Core
- [ ] SQL Server o In-Memory
- [ ] FluentValidation
- [ ] Pruebas unitarias
- [ ] Swagger documentación
- [ ] CORS configurado
- [ ] Logging con Serilog
- [ ] Middleware de errores

### Documentación
- [ ] README completo
- [ ] Instrucciones de instalación
- [ ] Instrucciones de ejecución
- [ ] Cómo correr tests
- [ ] Decisiones técnicas explicadas
- [ ] Arquitectura documentada
- [ ] Diagramas (opcional pero impresiona)

### Calidad
- [ ] Código limpio y bien organizado
- [ ] Nombres descriptivos
- [ ] Sin código comentado
- [ ] Sin console.logs en producción
- [ ] Git history limpio
- [ ] .gitignore correcto
- [ ] Sin secretos en código (appsettings.json en .gitignore)

### Opcional (para destacar)
- [ ] Docker Compose
- [ ] CI/CD con GitHub Actions
- [ ] Health check endpoint
- [ ] Refresh tokens
- [ ] Paginación en lista de tareas
- [ ] Búsqueda de tareas
- [ ] Categorías de tareas
- [ ] Fechas de vencimiento
- [ ] Prioridades

---

## 9. RECURSOS PARA ESTUDIAR

### Angular
- Documentación oficial: https://angular.io/docs
- NgRx: https://ngrx.io/docs
- Angular Material: https://material.angular.io/
- Cypress: https://docs.cypress.io/

### .NET
- Documentación oficial: https://learn.microsoft.com/dotnet
- Entity Framework Core: https://learn.microsoft.com/ef/core/
- Clean Architecture: https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html

### Patterns
- Repository Pattern
- Unit of Work
- Dependency Injection
- SOLID Principles

---

## CONCLUSIÓN

Este plan te prepara para **destacar** en la prueba técnica. No solo cumple con los requisitos, sino que va más allá con:

- Clean Architecture en backend
- NgRx para estado en frontend
- Testing robusto (unitarias + E2E)
- Optimizaciones de performance
- Docker para facilidad de ejecución
- Documentación completa
- Código limpio y profesional

**Estudia este documento a fondo**. Entiende **por qué** cada decisión, no solo **qué** hace el código. En la sustentación, demuestra que entiendes los conceptos profundamente y que puedes justificar cada elección técnica.

**¡Mucha suerte!** 🚀
