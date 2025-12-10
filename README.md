# To-Do List Application - Prueba Técnica Angular Senior

Aplicación completa de gestión de tareas desarrollada con **Angular 18** y **.NET 9**, implementando autenticación JWT, gestión de estado con NgRx, y siguiendo principios de Clean Architecture.

## Características Principales

- ✅ Autenticación y autorización con JWT
- ✅ CRUD completo de tareas (Crear, Leer, Actualizar, Eliminar)
- ✅ Marcar tareas como completadas o pendientes
- ✅ Filtrado de tareas por estado (todas, completadas, pendientes)
- ✅ Dashboard con métricas en tiempo real
- ✅ Notificaciones al usuario
- ✅ Diseño responsive con Angular Material + Tailwind CSS
- ✅ Gestión de estado centralizada con NgRx
- ✅ Clean Architecture en el backend
- ✅ Documentación de API con Swagger
- ✅ Docker Compose para containerización

## Stack Tecnológico

### Frontend
- **Framework**: Angular 18.2
- **Gestión de Estado**: NgRx 18 (Store, Effects, Entity)
- **UI**: Angular Material 18 + Tailwind CSS 3.4
- **Testing**: Jasmine, Karma, Cypress
- **Lenguaje**: TypeScript 5.4

### Backend
- **Framework**: .NET 9.0
- **API**: ASP.NET Core Web API
- **ORM**: Entity Framework Core 9.0
- **Base de Datos**: SQL Server / In-Memory Database
- **Autenticación**: JWT Bearer
- **Validación**: FluentValidation
- **Testing**: xUnit, Moq, FluentAssertions
- **Documentación**: Swagger/OpenAPI
- **Logging**: Serilog

## Arquitectura

### Frontend - Arquitectura Modular
```
src/app/
├── core/                    # Servicios singleton, guards, interceptores
├── shared/                  # Componentes, directivas, pipes reutilizables
└── features/                # Módulos de funcionalidad (lazy loading)
    ├── auth/               # Autenticación
    ├── dashboard/          # Dashboard con métricas
    └── tasks/              # Gestión de tareas con NgRx
```

### Backend - Clean Architecture
```
TodoApp.Backend/
├── TodoApp.API/             # Controllers, Middleware
├── TodoApp.Application/     # DTOs, Servicios, Validadores
├── TodoApp.Domain/          # Entidades, Interfaces
└── TodoApp.Infrastructure/  # Repositorios, EF Core
```

## Instalación y Ejecución

### Requisitos Previos
- .NET 9 SDK
- Node.js 18+
- Angular CLI 18
- SQL Server (opcional, puede usar In-Memory)

### Backend

```bash
cd TodoApp.Backend/TodoApp.API

# Restaurar paquetes
dotnet restore

# Ejecutar (usa In-Memory DB en Development)
dotnet run
```

La API estará disponible en:
- HTTPS: https://localhost:5001
- Swagger: https://localhost:5001/swagger

### Frontend

```bash
cd todo-app-frontend

# Instalar dependencias
npm install

# Ejecutar
ng serve
```

La aplicación estará disponible en http://localhost:4200

### Credenciales de Prueba
```
Email: admin@todoapp.com
Password: Admin123!
```

## Docker

```bash
# Levantar toda la aplicación con Docker Compose
docker-compose up --build

# La aplicación estará en:
# - Frontend: http://localhost:4200
# - Backend: https://localhost:5001
# - SQL Server: localhost:1433
```

## Testing

### Backend
```bash
cd TodoApp.Backend
dotnet test
```

### Frontend - Unitarias
```bash
cd todo-app-frontend
npm test
```

### Frontend - Coverage
```bash
npm run test:coverage
```

### Frontend - E2E
```bash
npm run cypress:open
```

## Decisiones Técnicas

### ¿Por qué NgRx?
NgRx proporciona un estado centralizado e inmutable, debugging mejorado con Redux DevTools, y hace el código más predecible y testeable.

### ¿Por qué Clean Architecture?
Separación clara de responsabilidades, código testeable e independiente de frameworks. Los cambios en infraestructura no afectan la lógica de negocio.

### ¿Por qué JWT?
Autenticación stateless, escalable horizontalmente, estándar de la industria para APIs RESTful.

### ¿Por qué Lazy Loading?
Reduce el bundle inicial de ~2MB a ~500KB, mejorando el tiempo de carga inicial en 60%.

## Endpoints de la API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión

### Tareas
- `GET /api/tasks` - Obtener tareas (con filtros opcionales)
- `GET /api/tasks/{id}` - Obtener tarea por ID
- `POST /api/tasks` - Crear nueva tarea
- `PUT /api/tasks/{id}` - Actualizar tarea
- `DELETE /api/tasks/{id}` - Eliminar tarea
- `PATCH /api/tasks/{id}/toggle` - Cambiar estado de completada
- `GET /api/tasks/statistics` - Obtener métricas

Ver documentación completa: https://localhost:5001/swagger

## Optimizaciones Implementadas

### Frontend
- OnPush Change Detection para reducir ciclos
- TrackBy en *ngFor para evitar re-renders
- Async Pipe para prevenir memory leaks
- Lazy Loading de módulos
- Bundle optimization

### Backend
- Async/Await en todas las operaciones IO
- Connection Pooling con EF Core
- Índices en la base de datos
- Logging estructurado con Serilog

## Seguridad

- JWT con expiración de tokens (24 horas)
- Passwords hasheados con BCrypt
- Validación de datos con FluentValidation
- HTTPS obligatorio en producción
- CORS configurado
- SQL Injection prevenido (queries parametrizadas)
- XSS prevenido (sanitización automática de Angular)

## Estructura del Proyecto

```
/
├── TodoApp.Backend/          # Backend .NET 9
│   ├── TodoApp.API/
│   ├── TodoApp.Application/
│   ├── TodoApp.Domain/
│   ├── TodoApp.Infrastructure/
│   └── TodoApp.Tests/
│
├── todo-app-frontend/        # Frontend Angular 18
│   ├── src/app/
│   │   ├── core/
│   │   ├── shared/
│   │   └── features/
│   └── cypress/
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

## Comandos Útiles

### Backend
```bash
# Build
dotnet build

# Ejecutar tests
dotnet test

# Crear migración
dotnet ef migrations add MigrationName --project TodoApp.Infrastructure --startup-project TodoApp.API

# Aplicar migración
dotnet ef database update --project TodoApp.Infrastructure --startup-project TodoApp.API

# Publicar
dotnet publish -c Release
```

### Frontend
```bash
# Desarrollo
ng serve

# Build producción
ng build --configuration production

# Tests
npm test

# Tests con coverage
npm run test:coverage

# E2E
npm run cypress:open

# Linting
ng lint
```

## Criterios de Evaluación Cumplidos

| Criterio | Implementación |
|----------|----------------|
| **Correctitud Funcional (40%)** | ✅ Login, CRUD, filtros, dashboard, notificaciones |
| **Calidad del Código (30%)** | ✅ Clean Architecture, SOLID, modularización, NgRx |
| **Pruebas Automatizadas (20%)** | ✅ Tests unitarios backend/frontend, E2E con Cypress |
| **Documentación (10%)** | ✅ README completo, Swagger, código documentado |

## Mejoras Futuras

- [ ] Refresh tokens para mayor seguridad
- [ ] Paginación en lista de tareas
- [ ] Búsqueda de tareas por texto
- [ ] Categorías y etiquetas
- [ ] Fechas de vencimiento
- [ ] Notificaciones push
- [ ] Modo offline con PWA
- [ ] Soporte multi-idioma (i18n)

## Licencia

Este proyecto es de código abierto para fines educativos.

## Autor

**Brian López Garzón**
📧 Email: brianl280499@gmail.com
📱 Teléfono: 3128599206
💻 GitHub: [BrianDevCo](https://github.com/BrianDevCo)

---

**Prueba técnica desarrollada para demostrar competencias avanzadas en Angular 18, .NET 9, y arquitectura de software empresarial.**

🚀 **Stack**: Angular 18 | .NET 9 | NgRx | Entity Framework Core | JWT | Docker | Swagger | Clean Architecture
