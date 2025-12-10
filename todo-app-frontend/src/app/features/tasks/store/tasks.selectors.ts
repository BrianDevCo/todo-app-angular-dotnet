import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TasksState } from './tasks.reducer';

export const selectTasksState = createFeatureSelector<TasksState>('tasks');

export const selectAllTasks = createSelector(
  selectTasksState,
  (state) => state.tasks
);

export const selectFilteredTasks = createSelector(
  selectAllTasks,
  selectTasksState,
  (tasks, state) => {
    switch (state.filter) {
      case 'completed':
        return tasks.filter(task => task.isCompleted);
      case 'pending':
        return tasks.filter(task => !task.isCompleted);
      default:
        return tasks;
    }
  }
);

export const selectTasksLoading = createSelector(
  selectTasksState,
  (state) => state.loading
);

export const selectTasksError = createSelector(
  selectTasksState,
  (state) => state.error
);

export const selectCurrentFilter = createSelector(
  selectTasksState,
  (state) => state.filter
);

export const selectTasksStatistics = createSelector(
  selectAllTasks,
  (tasks) => ({
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.isCompleted).length,
    pendingTasks: tasks.filter(t => !t.isCompleted).length
  })
);
