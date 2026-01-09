import { Component, inject, OnInit } from '@angular/core';
import { TaskStore } from '../../core/store/task.store';

@Component({
  selector: 'app-task-summary',
  imports: [],
  templateUrl: './task-summary.component.html',
  styleUrl: './task-summary.component.scss',
})
export class TaskSummaryComponent {
  readonly store = inject(TaskStore);
}
