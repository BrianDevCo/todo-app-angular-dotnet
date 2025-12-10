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
