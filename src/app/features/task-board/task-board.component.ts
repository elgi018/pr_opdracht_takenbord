import { Component, inject, OnInit } from '@angular/core';
import { TaskStore } from './store/task.store';

@Component({
  selector: 'app-task-board',
  imports: [],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.scss',
})
export class TaskBoardComponent implements OnInit {
  readonly store = inject(TaskStore);

  ngOnInit(): void {
    this.store.getTasks();
  }
}
