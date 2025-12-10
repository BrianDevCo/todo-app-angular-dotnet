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
