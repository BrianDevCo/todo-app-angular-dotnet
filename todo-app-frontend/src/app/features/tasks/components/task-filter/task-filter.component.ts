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
