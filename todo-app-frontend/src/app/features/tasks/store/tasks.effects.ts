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
