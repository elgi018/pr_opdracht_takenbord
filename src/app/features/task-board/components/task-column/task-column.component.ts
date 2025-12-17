import { Component, input } from '@angular/core';
import { iTask, TaskStatus } from '../../../../core/models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-task-column',
  imports: [TaskCardComponent],
  templateUrl: './task-column.component.html',
  styleUrl: './task-column.component.scss',
})
export class TaskColumnComponent {
  status = input.required<TaskStatus>();
  tasks = input.required<iTask[]>();
}
