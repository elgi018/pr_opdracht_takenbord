import { Injectable } from '@angular/core';
import { iTask, TASK_STATUS, TaskStatus } from '../models/task.model';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskApiService {
  private readonly STORAGE_KEY = 'TASKS';
  private readonly DELAY_MS = 500;

  constructor() {
    // Initialize with some demo tasks if storage is empty
    if (!this.getTasks().length) {
      this.initializeMockTasks();
    }
  }

  // Simulate getting tasks from backend
  getAllTasks(): Observable<iTask[]> {
    const tasks = this.getTasks();
    return of(tasks).pipe(delay(this.DELAY_MS));
  }

  private getTasks(): iTask[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return [];

      const tasks = JSON.parse(data);

      return tasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      }));
    } catch (error) {
      console.error('Error reading tasks from localStorage:', error);
      return [];
    }
  }

  updateTaskStatus(id: string, status: TaskStatus): Observable<iTask> {
    const tasks = this.getTasks();
    const task = tasks.find((t) => t.id === id);

    if (!task) {
      throw new Error('Task not found!');
    }

    const updatedTask: iTask = {
      ...task,
      status,
      updatedAt: new Date(),
    };

    const updatedTasks = tasks.map((t) => (t.id === id ? updatedTask : t));
    this.saveTasks(updatedTasks);

    return of(updatedTask).pipe(delay(this.DELAY_MS));
  }

  deleteTask(id: string): Observable<string> {
    const tasks = this.getTasks();
    const taskExists = tasks.some((t) => t.id === id);

    if (!taskExists) {
      throw new Error('Task not found!');
    }

    const updatedTasks = tasks.filter((t) => t.id !== id);
    this.saveTasks(updatedTasks);

    return of(id).pipe(delay(this.DELAY_MS));
  }

  private saveTasks(tasks: iTask[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  }

  private initializeMockTasks(): void {
    const mockTasks: iTask[] = [
      {
        id: crypto.randomUUID(),
        title: 'Fix login authentication bug',
        description:
          'Users are unable to login with special characters in password. Need to investigate encoding issues in auth service.',
        status: TASK_STATUS.IN_PROGRESS,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: crypto.randomUUID(),
        title: 'Implement dark mode toggle',
        description:
          'Add a theme switcher component that allows users to toggle between light and dark mode. Store preference in localStorage.',
        status: TASK_STATUS.TODO,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: crypto.randomUUID(),
        title: 'Write unit tests for user service',
        description:
          'Add comprehensive unit tests for the user service covering all CRUD operations and edge cases.',
        status: TASK_STATUS.TODO,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: crypto.randomUUID(),
        title: 'Optimize database queries',
        description:
          'Profile and optimize slow database queries in the reports module. Add proper indexes and consider query caching.',
        status: TASK_STATUS.IN_PROGRESS,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: crypto.randomUUID(),
        title: 'Update dependencies to latest versions',
        description:
          'Review and update all npm packages to their latest stable versions. Test for breaking changes.',
        status: TASK_STATUS.TODO,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: crypto.randomUUID(),
        title: 'Refactor API error handling',
        description:
          'Standardize error handling across all API endpoints. Implement consistent error response format.',
        status: TASK_STATUS.DONE,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: crypto.randomUUID(),
        title: 'Add pagination to task list',
        description:
          'Implement server-side pagination for the task list to improve performance with large datasets.',
        status: TASK_STATUS.IN_PROGRESS,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: crypto.randomUUID(),
        title: 'Setup CI/CD pipeline',
        description:
          'Configure GitHub Actions workflow for automated testing, linting, and deployment to staging environment.',
        status: TASK_STATUS.TODO,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: crypto.randomUUID(),
        title: 'Fix responsive layout issues on mobile',
        description:
          'Several components are breaking on mobile screens below 375px width. Fix CSS and test on various devices.',
        status: TASK_STATUS.DONE,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: crypto.randomUUID(),
        title: 'Implement real-time notifications',
        description:
          'Add WebSocket support for real-time push notifications when tasks are updated by other users.',
        status: TASK_STATUS.TODO,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    this.saveTasks(mockTasks);
  }
}
