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
