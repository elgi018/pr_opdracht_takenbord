import { computed, inject } from '@angular/core';
import {
  CreateTaskDto,
  iTask,
  iTaskSummary,
  TASK_STATUS,
  TaskStatus,
  UpdateTaskDto,
} from '../../../core/models/task.model';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { TaskApiService } from '../../../core/services/task-api.service';

interface TaskState {
  tasks: iTask[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

export const TaskStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    // Tasks Summary
    summary: computed((): iTaskSummary => {
      const tasks = store.tasks();
      return {
        todo: tasks.filter((t) => t.status === TASK_STATUS.TODO).length,
        inProgress: tasks.filter((t) => t.status === TASK_STATUS.IN_PROGRESS).length,
        done: tasks.filter((t) => t.status === TASK_STATUS.DONE).length,
      };
    }),

    // Group Tasks by status
    todoTasks: computed(() => store.tasks().filter((t) => t.status === TASK_STATUS.TODO)),
    inProgressTasks: computed(() =>
      store.tasks().filter((t) => t.status === TASK_STATUS.IN_PROGRESS)
    ),
    doneTasks: computed(() => store.tasks().filter((t) => t.status === TASK_STATUS.DONE)),
  })),
  withMethods((store) => {
    const apiService = inject(TaskApiService);
    return {
      // Get All Tasks
      getTasks: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap(() => apiService.getAllTasks()),
          tap({
            next: (tasks) => patchState(store, { tasks, loading: false }),
            error: (error) =>
              patchState(store, {
                error: error.message || 'Failed fetching tasks',
                loading: false,
              }),
          })
        )
      ),

      // Add new Task
      createNewTask: rxMethod<CreateTaskDto>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap((data) => apiService.createTask(data)),
          tap({
            next: (newTask) => {
              const tasks = [...store.tasks(), newTask];
              patchState(store, { tasks, loading: false });
            },
            error: (error) =>
              patchState(store, {
                error: error.message || 'Failed to create task',
                loading: false,
              }),
          })
        )
      ),

      // Update Task
      updateTask: rxMethod<{ id: string; data: UpdateTaskDto }>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap(({ id, data }) => apiService.updateTask(id, data)),
          tap({
            next: (updatedTask) => {
              if (updatedTask) {
                const tasks = store
                  .tasks()
                  .map((task) => (task.id === updatedTask.id ? updatedTask : task));
                patchState(store, { tasks, loading: false });
              } else {
                patchState(store, {
                  error: 'Task not found',
                  loading: false,
                });
              }
            },
            error: (error) =>
              patchState(store, {
                error: error.message || 'Failed to update task',
                loading: false,
              }),
          })
        )
      ),

      // Update Task Status
      UpdateTaskStatus: rxMethod<{ id: string; status: TaskStatus }>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap(({ id, status }) =>
            apiService.updateTaskStatus(id, status).pipe(
              tap({
                next: (updatedTask) => {
                  const updatedTasks = store
                    .tasks()
                    .map((task) => (task.id === id ? updatedTask : task));
                  patchState(store, { tasks: updatedTasks, loading: false });
                },
                error: (error) =>
                  patchState(store, {
                    error: error.message || 'Failed updating task status',
                    loading: false,
                  }),
              })
            )
          )
        )
      ),

      // Delete Task
      deleteTask: rxMethod<{ id: string }>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap(({ id }) => apiService.deleteTask(id)),
          tap({
            next: (id) => {
              const updatedTasks = store.tasks().filter((task) => task.id !== id);
              patchState(store, { tasks: updatedTasks, loading: false });
            },
            error: (error) =>
              patchState(store, {
                error: error.message || 'Failed deleting task',
                loading: false,
              }),
          })
        )
      ),
    };
  })
);
