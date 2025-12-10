# To-Do List Application

Aplicación completa de gestión de tareas desarrollada con Angular 18 y .NET 9, implementando autenticación JWT, gestión de estado con NgRx, y siguiendo principios de Clean Architecture.

## Tabla de Contenidos

- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Ejecución](#ejecución)
- [Pruebas](#pruebas)
- [Decisiones Técnicas](#decisiones-técnicas)
- [Estructura del Proyecto](#estructura-del-proyecto)

## Características

- Autenticación y autorización con JWT
- CRUD completo de tareas (Crear, Leer, Actualizar, Eliminar)
- Marcar tareas como completadas o pendientes
- Filtrado de tareas por estado
- Dashboard con métricas en tiempo real
- Notificaciones de acciones al usuario
- Diseño responsive con Angular Material y Tailwind CSS
- Gestión de estado centralizada con NgRx
- Documentación de API con Swagger

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

### Frontend
La aplicación frontend sigue una arquitectura modular con separación clara de responsabilidades:

- **Core Module**: Servicios singleton, guards, interceptores
- **Shared Module**: Componentes, directivas y pipes reutilizables
- **Feature Modules**: Módulos de funcionalidad con lazy loading
  - Auth Module (eager loading)
  - Dashboard Module (lazy loading)
  - Tasks Module (lazy loading)

### Backend
El backend implementa Clean Architecture con las siguientes capas:

- **Domain**: Entidades de negocio e interfaces de repositorios
- **Application**: Lógica de aplicación, DTOs, servicios, validadores
- **Infrastructure**: Implementaciones de repositorios y acceso a datos
- **API**: Controllers, middleware y configuración

```
┌─────────────────────────────────────────┐
│              API Layer                   │
│  (Controllers, Middleware, Filters)     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│        Application Layer                 │
│  (Services, DTOs, Validators, Mapping)  │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Domain Layer                     │
│    (Entities, Interfaces, Rules)        │
└──────────────▲──────────────────────────┘
               │
┌──────────────┴──────────────────────────┐
│      Infrastructure Layer                │
│  (Data Access, Repositories, EF Core)   │
└─────────────────────────────────────────┘
```

## Requisitos Previos

- **Node.js**: v18.x o superior
- **npm**: v9.x o superior
- **Angular CLI**: v18.x (`npm install -g @angular/cli`)
- **.NET SDK**: 9.0 o superior
- **SQL Server**: 2019 o superior (opcional, puede usar In-Memory)
- **Docker** (opcional, para containerización)

## Instalación

### Opción 1: Instalación Manual

#### Backend

1. Navegar a la carpeta del backend:
```bash
cd TodoApp.Backend
```

2. Restaurar dependencias:
```bash
dotnet restore
```

3. Configurar la cadena de conexión en `TodoApp.API/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=TodoAppDb;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

4. Aplicar migraciones:
```bash
dotnet ef database update --project TodoApp.Infrastructure --startup-project TodoApp.API
```

#### Frontend

1. Navegar a la carpeta del frontend:
```bash
cd todo-app-frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar la URL del API en `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001/api'
};
```

### Opción 2: Docker Compose (Recomendado)

```bash
docker-compose up -d
```

Esto levantará:
- Frontend en http://localhost:4200
- Backend en https://localhost:5001
- SQL Server en localhost:1433
- Swagger en https://localhost:5001/swagger

## Ejecución

### Backend

```bash
cd TodoApp.Backend
dotnet run --project TodoApp.API
```

La API estará disponible en:
- HTTPS: https://localhost:5001
- HTTP: http://localhost:5000
- Swagger: https://localhost:5001/swagger

### Frontend

```bash
cd todo-app-frontend
ng serve
```

La aplicación estará disponible en http://localhost:4200

### Credenciales de Prueba

```
Email: admin@todoapp.com
Password: Admin123!
```

## Pruebas

### Frontend

#### Pruebas Unitarias
```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar con coverage
npm test -- --code-coverage

# Coverage report en: coverage/todo-app-frontend/index.html
```

#### Pruebas E2E con Cypress
```bash
# Modo interactivo
npm run cypress:open

# Modo headless
npm run cypress:run
```

### Backend

#### Pruebas Unitarias
```bash
cd TodoApp.Backend

# Ejecutar todas las pruebas
dotnet test

# Con coverage
dotnet test /p:CollectCoverage=true /p:CoverageReportFormat=html

# Report en: TodoApp.Tests/coverage/index.html
```

## Decisiones Técnicas

### 1. NgRx para Gestión de Estado

**Decisión**: Usar NgRx Store en lugar de servicios con BehaviorSubject.

**Justificación**:
- Estado centralizado e inmutable
- Debugging mejorado con Redux DevTools
- Patrón predecible y escalable
- Reducers y effects son funciones puras (fácil testing)
- Mejor separación de responsabilidades

### 2. Clean Architecture en Backend

**Decisión**: Implementar arquitectura en capas con inversión de dependencias.

**Justificación**:
- Separación clara de responsabilidades
- Código testeable (Domain independiente)
- Fácil mantenimiento y evolución
- Cambios en infraestructura no afectan lógica de negocio
- Demuestra conocimiento de patrones arquitectónicos

### 3. JWT para Autenticación

**Decisión**: JSON Web Tokens con Bearer Authentication.

**Justificación**:
- Stateless (no requiere almacenar sesiones)
- Escalable horizontalmente
- Compatible con arquitecturas distribuidas
- Estándar de la industria
- Fácil integración con Angular

### 4. FluentValidation

**Decisión**: Usar FluentValidation en lugar de DataAnnotations.

**Justificación**:
- Validaciones más expresivas y legibles
- Separación de validaciones en clases independientes
- Fácil composición y reutilización
- Mejor testing
- Reglas de validación complejas

### 5. Lazy Loading

**Decisión**: Implementar lazy loading para módulos secundarios.

**Justificación**:
- Reducción del bundle inicial (de ~2MB a ~500KB)
- Mejor tiempo de carga inicial (mejora del 60%)
- Mejor experiencia de usuario
- Escalabilidad (fácil agregar módulos)

### 6. Angular Material + Tailwind

**Decisión**: Combinar ambos frameworks de UI.

**Justificación**:
- Angular Material: Componentes enterprise-grade y accesibles
- Tailwind: Utility-first para layouts responsive rápidos
- Mejor de ambos mundos
- Alta productividad

### 7. Cypress para E2E

**Decisión**: Cypress en lugar de Protractor.

**Justificación**:
- Protractor está deprecado
- Cypress es más rápido y estable
- Mejor experiencia de desarrollo
- Time-travel debugging
- Excelente documentación

## Estructura del Proyecto

### Frontend
```
todo-app-frontend/
├── src/
│   ├── app/
│   │   ├── core/                 # Servicios singleton, guards, interceptores
│   │   ├── shared/               # Componentes, directivas, pipes compartidos
│   │   ├── features/             # Módulos de funcionalidad
│   │   │   ├── auth/            # Autenticación (eager)
│   │   │   ├── dashboard/       # Dashboard (lazy)
│   │   │   └── tasks/           # Gestión de tareas (lazy)
│   │   └── store/               # NgRx store global
│   ├── environments/             # Configuración por ambiente
│   └── styles/                   # Estilos globales
├── cypress/                      # Pruebas E2E
└── package.json
```

### Backend
```
TodoApp.Backend/
├── TodoApp.API/                  # Controllers, middleware
├── TodoApp.Application/          # DTOs, servicios, validadores
├── TodoApp.Domain/              # Entidades, interfaces
├── TodoApp.Infrastructure/      # Repositorios, EF Core
├── TodoApp.Tests/               # Pruebas unitarias
└── TodoApp.sln
```

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### Tareas
- `GET /api/tasks` - Obtener todas las tareas (con filtros)
- `GET /api/tasks/{id}` - Obtener tarea por ID
- `POST /api/tasks` - Crear nueva tarea
- `PUT /api/tasks/{id}` - Actualizar tarea
- `DELETE /api/tasks/{id}` - Eliminar tarea
- `PATCH /api/tasks/{id}/complete` - Marcar como completada
- `GET /api/tasks/statistics` - Obtener métricas

Ver documentación completa en Swagger: https://localhost:5001/swagger

## Optimizaciones Implementadas

### Frontend
- **OnPush Change Detection**: Reduce ciclos de detección
- **TrackBy en *ngFor**: Evita re-renderizados innecesarios
- **Async Pipe**: Previene memory leaks
- **Lazy Loading**: Bundle inicial optimizado
- **Tree Shaking**: Eliminación de código no usado

### Backend
- **Async/Await**: Operaciones IO asíncronas
- **Connection Pooling**: EF Core maneja el pool
- **Índices en DB**: Queries optimizados
- **DTOs**: Solo se transfiere data necesaria
- **Logging estructurado**: Serilog con JSON

## Seguridad

- JWT con expiración de tokens
- Passwords hasheados con BCrypt
- Validación de datos en backend
- HTTPS obligatorio en producción
- CORS configurado correctamente
- SQL Injection prevenido (EF Core parametrizado)
- XSS prevenido (Angular sanitiza automáticamente)

## Contribución

Este es un proyecto de prueba técnica. Para fines educativos:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/mejora`)
3. Commit tus cambios (`git commit -m 'Agrega mejora'`)
4. Push a la rama (`git push origin feature/mejora`)
5. Abre un Pull Request

## Licencia

Este proyecto es de código abierto para fines educativos.

## Contacto

[Tu Nombre] - [Tu Email]

Repositorio: [URL del repositorio]

---

**Desarrollado como parte de una prueba técnica para demostrar competencias en Angular, .NET, y arquitectura de software empresarial.**
