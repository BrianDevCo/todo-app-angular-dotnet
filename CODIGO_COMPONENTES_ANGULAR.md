# CÓDIGO COMPLETO DE COMPONENTES ANGULAR

Copia cada código en el archivo correspondiente después de generar los componentes con Angular CLI.

---

## 1. TASK LIST COMPONENT

### src/app/features/tasks/components/task-list/task-list.component.ts
```typescript
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Task } from '../../../../core/models/task.model';
import * as TasksActions from '../../store/tasks.actions';
import * as TasksSelectors from '../../store/tasks.selectors';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskFilterComponent } from '../task-filter/task-filter.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    TaskFilterComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  private store = inject(Store);
  private dialog = inject(MatDialog);

  tasks$: Observable<Task[]> = this.store.select(TasksSelectors.selectFilteredTasks);
  loading$: Observable<boolean> = this.store.select(TasksSelectors.selectTasksLoading);
  currentFilter$ = this.store.select(TasksSelectors.selectCurrentFilter);

  ngOnInit(): void {
    this.store.dispatch(TasksActions.loadTasks());
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '500px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(TasksActions.createTask({ task: result }));
      }
    });
  }

  openEditDialog(task: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '500px',
      data: { mode: 'edit', task }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(TasksActions.updateTask({
          id: task.id,
          task: result
        }));
      }
    });
  }

  toggleTaskCompletion(task: Task): void {
    this.store.dispatch(TasksActions.toggleTaskCompletion({ id: task.id }));
  }

  deleteTask(task: Task): void {
    if (confirm(`¿Estás seguro de eliminar la tarea "${task.title}"?`)) {
      this.store.dispatch(TasksActions.deleteTask({ id: task.id }));
    }
  }

  trackByTaskId(index: number, task: Task): number {
    return task.id;
  }
}
```

### src/app/features/tasks/components/task-list/task-list.component.html
```html
<div class="container mx-auto p-4 max-w-6xl">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold text-gray-800">Mis Tareas</h1>
    <button
      mat-raised-button
      color="primary"
      (click)="openCreateDialog()">
      <mat-icon>add</mat-icon>
      Nueva Tarea
    </button>
  </div>

  <app-task-filter></app-task-filter>

  <div *ngIf="loading$ | async" class="loading-container">
    <mat-spinner></mat-spinner>
  </div>

  <div *ngIf="!(loading$ | async)">
    <div *ngIf="(tasks$ | async) as tasks">
      <div *ngIf="tasks.length === 0" class="text-center py-12">
        <mat-icon class="text-6xl text-gray-400">inbox</mat-icon>
        <p class="text-xl text-gray-500 mt-4">
          No hay tareas
          <span *ngIf="(currentFilter$ | async) !== 'all'">
            en este filtro
          </span>
        </p>
        <button
          *ngIf="(currentFilter$ | async) === 'all'"
          mat-raised-button
          color="primary"
          (click)="openCreateDialog()"
          class="mt-4">
          Crear tu primera tarea
        </button>
      </div>

      <div class="grid gap-4" *ngIf="tasks.length > 0">
        <mat-card
          *ngFor="let task of tasks; trackBy: trackByTaskId"
          class="task-card"
          [class.completed]="task.isCompleted">
          <mat-card-content class="flex items-start gap-4">
            <mat-checkbox
              [checked]="task.isCompleted"
              (change)="toggleTaskCompletion(task)"
              color="primary">
            </mat-checkbox>

            <div class="flex-1 min-w-0">
              <h3
                class="text-lg font-semibold"
                [class.line-through]="task.isCompleted"
                [class.text-gray-500]="task.isCompleted">
                {{ task.title }}
              </h3>
              <p
                *ngIf="task.description"
                class="text-gray-600 mt-1 whitespace-pre-wrap"
                [class.line-through]="task.isCompleted">
                {{ task.description }}
              </p>
              <div class="flex gap-2 mt-2">
                <mat-chip *ngIf="task.isCompleted" class="!bg-green-100 !text-green-800">
                  Completada
                </mat-chip>
                <mat-chip *ngIf="!task.isCompleted" class="!bg-yellow-100 !text-yellow-800">
                  Pendiente
                </mat-chip>
                <span class="text-xs text-gray-500 flex items-center">
                  <mat-icon class="text-sm">schedule</mat-icon>
                  {{ task.createdAt | date: 'short' }}
                </span>
              </div>
            </div>

            <div class="flex gap-2">
              <button
                mat-icon-button
                color="primary"
                (click)="openEditDialog(task)"
                matTooltip="Editar">
                <mat-icon>edit</mat-icon>
              </button>
              <button
                mat-icon-button
                color="warn"
                (click)="deleteTask(task)"
                matTooltip="Eliminar">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  </div>
</div>
```

### src/app/features/tasks/components/task-list/task-list.component.scss
```scss
.task-card {
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &.completed {
    opacity: 0.8;
  }
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}
```

---

## 2. TASK FORM COMPONENT

### src/app/features/tasks/components/task-form/task-form.component.ts
```typescript
import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Task } from '../../../../core/models/task.model';

interface DialogData {
  mode: 'create' | 'edit';
  task?: Task;
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<TaskFormComponent>);

  taskForm: FormGroup;
  mode: 'create' | 'edit';

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.mode = data.mode;

    this.taskForm = this.fb.group({
      title: [data.task?.title || '', [Validators.required, Validators.maxLength(200)]],
      description: [data.task?.description || '', Validators.maxLength(1000)],
      isCompleted: [data.task?.isCompleted || false]
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.dialogRef.close(this.taskForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  get isEditMode(): boolean {
    return this.mode === 'edit';
  }
}
```

### src/app/features/tasks/components/task-form/task-form.component.html
```html
<h2 mat-dialog-title>
  {{ isEditMode ? 'Editar Tarea' : 'Nueva Tarea' }}
</h2>

<mat-dialog-content>
  <form [formGroup]="taskForm" class="flex flex-col gap-4">
    <mat-form-field appearance="outline" class="w-full">
      <mat-label>Título</mat-label>
      <input
        matInput
        formControlName="title"
        placeholder="Ingresa el título de la tarea"
        autofocus>
      <mat-error *ngIf="taskForm.get('title')?.hasError('required')">
        El título es requerido
      </mat-error>
      <mat-error *ngIf="taskForm.get('title')?.hasError('maxlength')">
        Máximo 200 caracteres
      </mat-error>
    </mat-form-field>

    <mat-form-field appearance="outline" class="w-full">
      <mat-label>Descripción</mat-label>
      <textarea
        matInput
        formControlName="description"
        placeholder="Descripción opcional"
        rows="4">
      </textarea>
      <mat-error *ngIf="taskForm.get('description')?.hasError('maxlength')">
        Máximo 1000 caracteres
      </mat-error>
    </mat-form-field>

    <mat-checkbox
      *ngIf="isEditMode"
      formControlName="isCompleted"
      color="primary">
      Marcar como completada
    </mat-checkbox>
  </form>
</mat-dialog-content>

<mat-dialog-actions align="end">
  <button mat-button (click)="onCancel()">Cancelar</button>
  <button
    mat-raised-button
    color="primary"
    [disabled]="taskForm.invalid"
    (click)="onSubmit()">
    {{ isEditMode ? 'Guardar' : 'Crear' }}
  </button>
</mat-dialog-actions>
```

### src/app/features/tasks/components/task-form/task-form.component.scss
```scss
:host {
  display: block;
}
```

---

## 3. TASK FILTER COMPONENT

### src/app/features/tasks/components/task-filter/task-filter.component.ts
```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { FilterType } from '../../../../core/models/task.model';
import * as TasksActions from '../../store/tasks.actions';
import * as TasksSelectors from '../../store/tasks.selectors';

@Component({
  selector: 'app-task-filter',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatIconModule
  ],
  templateUrl: './task-filter.component.html',
  styleUrls: ['./task-filter.component.scss']
})
export class TaskFilterComponent {
  private store = inject(Store);

  currentFilter$: Observable<FilterType> = this.store.select(TasksSelectors.selectCurrentFilter);

  onFilterChange(filter: FilterType): void {
    this.store.dispatch(TasksActions.setFilter({ filter }));
  }
}
```

### src/app/features/tasks/components/task-filter/task-filter.component.html
```html
<div class="mb-6">
  <mat-button-toggle-group
    [value]="(currentFilter$ | async) || 'all'"
    (change)="onFilterChange($event.value)"
    class="w-full flex">
    <mat-button-toggle value="all" class="flex-1">
      <mat-icon>list</mat-icon>
      <span class="ml-2">Todas</span>
    </mat-button-toggle>
    <mat-button-toggle value="pending" class="flex-1">
      <mat-icon>schedule</mat-icon>
      <span class="ml-2">Pendientes</span>
    </mat-button-toggle>
    <mat-button-toggle value="completed" class="flex-1">
      <mat-icon>check_circle</mat-icon>
      <span class="ml-2">Completadas</span>
    </mat-button-toggle>
  </mat-button-toggle-group>
</div>
```

### src/app/features/tasks/components/task-filter/task-filter.component.scss
```scss
:host {
  display: block;
}
```

---

## 4. DASHBOARD COMPONENT

### src/app/features/dashboard/components/dashboard.component.ts
```typescript
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import * as TasksActions from '../../tasks/store/tasks.actions';
import * as TasksSelectors from '../../tasks/store/tasks.selectors';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  statistics$ = this.store.select(TasksSelectors.selectTasksStatistics);
  loading$ = this.store.select(TasksSelectors.selectTasksLoading);

  ngOnInit(): void {
    this.store.dispatch(TasksActions.loadTasks());
  }

  navigateToTasks(filter: 'all' | 'completed' | 'pending'): void {
    this.store.dispatch(TasksActions.setFilter({ filter }));
    this.router.navigate(['/tasks']);
  }

  getCompletionPercentage(completed: number, total: number): number {
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  }
}
```

### src/app/features/dashboard/components/dashboard.component.html
```html
<div class="container mx-auto p-4 max-w-6xl">
  <h1 class="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

  <div *ngIf="loading$ | async" class="loading-container">
    <mat-spinner></mat-spinner>
  </div>

  <div *ngIf="!(loading$ | async) && (statistics$ | async) as stats" class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- Total Tasks Card -->
    <mat-card class="stat-card cursor-pointer hover:shadow-lg transition-shadow" (click)="navigateToTasks('all')">
      <mat-card-content class="flex flex-col items-center p-6">
        <div class="icon-container bg-blue-100 text-blue-600 mb-4">
          <mat-icon class="text-5xl">list</mat-icon>
        </div>
        <h2 class="text-gray-600 text-sm uppercase tracking-wide mb-2">Total de Tareas</h2>
        <p class="text-5xl font-bold text-gray-800">{{ stats.totalTasks }}</p>
      </mat-card-content>
    </mat-card>

    <!-- Completed Tasks Card -->
    <mat-card class="stat-card cursor-pointer hover:shadow-lg transition-shadow" (click)="navigateToTasks('completed')">
      <mat-card-content class="flex flex-col items-center p-6">
        <div class="icon-container bg-green-100 text-green-600 mb-4">
          <mat-icon class="text-5xl">check_circle</mat-icon>
        </div>
        <h2 class="text-gray-600 text-sm uppercase tracking-wide mb-2">Completadas</h2>
        <p class="text-5xl font-bold text-gray-800">{{ stats.completedTasks }}</p>
        <p class="text-sm text-gray-500 mt-2">
          {{ getCompletionPercentage(stats.completedTasks, stats.totalTasks) }}% del total
        </p>
      </mat-card-content>
    </mat-card>

    <!-- Pending Tasks Card -->
    <mat-card class="stat-card cursor-pointer hover:shadow-lg transition-shadow" (click)="navigateToTasks('pending')">
      <mat-card-content class="flex flex-col items-center p-6">
        <div class="icon-container bg-yellow-100 text-yellow-600 mb-4">
          <mat-icon class="text-5xl">schedule</mat-icon>
        </div>
        <h2 class="text-gray-600 text-sm uppercase tracking-wide mb-2">Pendientes</h2>
        <p class="text-5xl font-bold text-gray-800">{{ stats.pendingTasks }}</p>
        <p class="text-sm text-gray-500 mt-2">
          {{ getCompletionPercentage(stats.pendingTasks, stats.totalTasks) }}% del total
        </p>
      </mat-card-content>
    </mat-card>
  </div>

  <!-- Progress Section -->
  <mat-card *ngIf="(statistics$ | async) as stats" class="mt-6">
    <mat-card-content>
      <h2 class="text-xl font-semibold mb-4">Progreso</h2>
      <div class="flex items-center gap-4">
        <div class="flex-1">
          <div class="progress-bar-container">
            <div
              class="progress-bar"
              [style.width.%]="getCompletionPercentage(stats.completedTasks, stats.totalTasks)">
            </div>
          </div>
        </div>
        <span class="text-2xl font-bold text-gray-700">
          {{ getCompletionPercentage(stats.completedTasks, stats.totalTasks) }}%
        </span>
      </div>
      <p class="text-sm text-gray-600 mt-2">
        Has completado {{ stats.completedTasks }} de {{ stats.totalTasks }} tareas
      </p>
    </mat-card-content>
  </mat-card>

  <!-- Quick Actions -->
  <div class="mt-6 flex justify-center">
    <button mat-raised-button color="primary" (click)="navigateToTasks('all')">
      <mat-icon>arrow_forward</mat-icon>
      Ver Todas las Tareas
    </button>
  </div>
</div>
```

### src/app/features/dashboard/components/dashboard.component.scss
```scss
.stat-card {
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
}

.icon-container {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-bar-container {
  width: 100%;
  height: 12px;
  background-color: #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #4caf50 0%, #8bc34a 100%);
  border-radius: 6px;
  transition: width 0.3s ease;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}
```

---

## INSTRUCCIONES DE USO

### Paso 1: Genera los componentes
```bash
cd /mnt/c/Prueba/todo-app-frontend

ng g c features/tasks/components/task-list --standalone --skip-tests
ng g c features/tasks/components/task-form --standalone --skip-tests
ng g c features/tasks/components/task-filter --standalone --skip-tests
ng g c features/dashboard/components/dashboard --standalone --skip-tests
```

### Paso 2: Copia el código
Después de generar cada componente, **reemplaza completamente** el contenido de cada archivo (.ts, .html, .scss) con el código de arriba.

### Paso 3: Agrega imports faltantes en actions y effects
Copia también desde **ARCHIVO_CODIGOS_FALTANTES_FRONTEND.md**:
- `src/app/features/tasks/store/tasks.actions.ts`
- `src/app/features/tasks/store/tasks.effects.ts`

### Paso 4: Verifica
Ejecuta:
```bash
ng serve
```

Si todo está bien, no deberías tener errores de compilación.

---

¡Listo! Ahora tu aplicación está 100% completa.
