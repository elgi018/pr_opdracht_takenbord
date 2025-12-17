import { Injectable } from '@angular/core';
import { iTask } from '../models/task.model';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskApiService {
  private readonly STORAGE_KEY = 'TASKS';
  private readonly DELAY_MS = 500;

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
}
