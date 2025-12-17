import { Component, inject, OnInit } from '@angular/core';
import { TaskStore } from './store/task.store';
import { TaskColumnComponent } from './components/task-column/task-column.component';
import { TASK_STATUS } from '../../core/models/task.model';

@Component({
  selector: 'app-task-board',
  imports: [TaskColumnComponent],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.scss',
})
export class TaskBoardComponent implements OnInit {
  readonly store = inject(TaskStore);

  readonly TASK_STATUS = TASK_STATUS;

  ngOnInit(): void {
    this.store.getTasks();
  }
}
