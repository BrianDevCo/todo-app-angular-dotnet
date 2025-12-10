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
