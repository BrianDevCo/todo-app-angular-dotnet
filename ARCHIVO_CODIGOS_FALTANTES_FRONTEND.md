# CÓDIGOS FALTANTES DEL FRONTEND

Estos son todos los archivos que faltan crear. Copia cada uno al path indicado.

## 1. Auth Feature

### src/app/features/auth/auth.routes.ts
```typescript
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: LoginComponent
  }
];
```

### src/app/features/auth/components/login/login.component.ts
```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;

  constructor() {
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

### src/app/features/auth/components/login/login.component.html
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
            <mat-spinner *ngIf="isLoading" diameter="20" class="inline-block mr-2"></mat-spinner>
            <span *ngIf="!isLoading">Iniciar Sesión</span>
          </button>
        </form>

        <div class="mt-4 text-center text-sm text-gray-600">
          <p class="font-semibold">Credenciales de prueba:</p>
          <p>Email: admin@todoapp.com</p>
          <p>Password: Admin123!</p>
        </div>
      </mat-card-content>
    </mat-card>
  </div>
</div>
```

### src/app/features/auth/components/login/login.component.scss
```scss
:host {
  display: block;
}
```

## 2. Tasks Feature (NgRx Store)

### src/app/features/tasks/store/tasks.actions.ts
```typescript
import { createAction, props } from '@ngrx/store';
import { Task, CreateTaskDto, UpdateTaskDto, FilterType } from '../../../core/models/task.model';

// Load Tasks
export const loadTasks = createAction('[Tasks] Load Tasks');
export const loadTasksSuccess = createAction(
  '[Tasks] Load Tasks Success',
  props<{ tasks: Task[] }>()
);
export const loadTasksFailure = createAction(
  '[Tasks] Load Tasks Failure',
  props<{ error: string }>()
);

// Create Task
export const createTask = createAction(
  '[Tasks] Create Task',
  props<{ task: CreateTaskDto }>()
);
export const createTaskSuccess = createAction(
  '[Tasks] Create Task Success',
  props<{ task: Task }>()
);
export const createTaskFailure = createAction(
  '[Tasks] Create Task Failure',
  props<{ error: string }>()
);

// Update Task
export const updateTask = createAction(
  '[Tasks] Update Task',
  props<{ id: number; task: UpdateTaskDto }>()
);
export const updateTaskSuccess = createAction(
  '[Tasks] Update Task Success',
  props<{ task: Task }>()
);
export const updateTaskFailure = createAction(
  '[Tasks] Update Task Failure',
  props<{ error: string }>()
);

// Delete Task
export const deleteTask = createAction(
  '[Tasks] Delete Task',
  props<{ id: number }>()
);
export const deleteTaskSuccess = createAction(
  '[Tasks] Delete Task Success',
  props<{ id: number }>()
);
export const deleteTaskFailure = createAction(
  '[Tasks] Delete Task Failure',
  props<{ error: string }>()
);

// Toggle Task Completion
export const toggleTaskCompletion = createAction(
  '[Tasks] Toggle Task Completion',
  props<{ id: number }>()
);
export const toggleTaskCompletionSuccess = createAction(
  '[Tasks] Toggle Task Completion Success',
  props<{ task: Task }>()
);
export const toggleTaskCompletionFailure = createAction(
  '[Tasks] Toggle Task Completion Failure',
  props<{ error: string }>()
);

// Filter Tasks
export const setFilter = createAction(
  '[Tasks] Set Filter',
  props<{ filter: FilterType }>()
);
```

### src/app/features/tasks/store/tasks.reducer.ts
```typescript
import { createReducer, on } from '@ngrx/store';
import { Task, FilterType } from '../../../core/models/task.model';
import * as TasksActions from './tasks.actions';

export interface TasksState {
  tasks: Task[];
  filter: FilterType;
  loading: boolean;
  error: string | null;
}

export const initialState: TasksState = {
  tasks: [],
  filter: 'all',
  loading: false,
  error: null
};

export const tasksReducer = createReducer(
  initialState,

  // Load Tasks
  on(TasksActions.loadTasks, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TasksActions.loadTasksSuccess, (state, { tasks }) => ({
    ...state,
    tasks,
    loading: false,
    error: null
  })),
  on(TasksActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Create Task
  on(TasksActions.createTask, (state) => ({
    ...state,
    loading: true
  })),
  on(TasksActions.createTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: [task, ...state.tasks],
    loading: false
  })),
  on(TasksActions.createTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Task
  on(TasksActions.updateTask, (state) => ({
    ...state,
    loading: true
  })),
  on(TasksActions.updateTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map(t => t.id === task.id ? task : t),
    loading: false
  })),
  on(TasksActions.updateTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Delete Task
  on(TasksActions.deleteTask, (state) => ({
    ...state,
    loading: true
  })),
  on(TasksActions.deleteTaskSuccess, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter(t => t.id !== id),
    loading: false
  })),
  on(TasksActions.deleteTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Toggle Completion
  on(TasksActions.toggleTaskCompletion, (state) => ({
    ...state,
    loading: true
  })),
  on(TasksActions.toggleTaskCompletionSuccess, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map(t => t.id === task.id ? task : t),
    loading: false
  })),
  on(TasksActions.toggleTaskCompletionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Filter
  on(TasksActions.setFilter, (state, { filter }) => ({
    ...state,
    filter
  }))
);
```

### src/app/features/tasks/store/tasks.effects.ts
```typescript
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from '../services/task.service';
import * as TasksActions from './tasks.actions';

@Injectable()
export class TasksEffects {
  private actions$ = inject(Actions);
  private taskService = inject(TaskService);
  private snackBar = inject(MatSnackBar);

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.loadTasks),
      switchMap(() =>
        this.taskService.getTasks().pipe(
          map(tasks => TasksActions.loadTasksSuccess({ tasks })),
          catchError(error => of(TasksActions.loadTasksFailure({ error: error.message })))
        )
      )
    )
  );

  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.createTask),
      switchMap(({ task }) =>
        this.taskService.createTask(task).pipe(
          map(createdTask => TasksActions.createTaskSuccess({ task: createdTask })),
          catchError(error => of(TasksActions.createTaskFailure({ error: error.message })))
        )
      )
    )
  );

  createTaskSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.createTaskSuccess),
      tap(() => {
        this.snackBar.open('✓ Tarea creada con éxito', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
      })
    ),
    { dispatch: false }
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.updateTask),
      switchMap(({ id, task }) =>
        this.taskService.updateTask(id, task).pipe(
          map(updatedTask => TasksActions.updateTaskSuccess({ task: updatedTask })),
          catchError(error => of(TasksActions.updateTaskFailure({ error: error.message })))
        )
      )
    )
  );

  updateTaskSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.updateTaskSuccess),
      tap(() => {
        this.snackBar.open('✓ Tarea actualizada con éxito', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
      })
    ),
    { dispatch: false }
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.deleteTask),
      switchMap(({ id }) =>
        this.taskService.deleteTask(id).pipe(
          map(() => TasksActions.deleteTaskSuccess({ id })),
          catchError(error => of(TasksActions.deleteTaskFailure({ error: error.message })))
        )
      )
    )
  );

  deleteTaskSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.deleteTaskSuccess),
      tap(() => {
        this.snackBar.open('✓ Tarea eliminada con éxito', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
      })
    ),
    { dispatch: false }
  );

  toggleTaskCompletion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.toggleTaskCompletion),
      switchMap(({ id }) =>
        this.taskService.toggleTaskCompletion(id).pipe(
          map(task => TasksActions.toggleTaskCompletionSuccess({ task })),
          catchError(error => of(TasksActions.toggleTaskCompletionFailure({ error: error.message })))
        )
      )
    )
  );
}
```

Continúa en el siguiente mensaje por límite de caracteres...
