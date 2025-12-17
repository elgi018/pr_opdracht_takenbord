import { Component, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { iTask, TASK_STATUS } from '../../../../core/models/task.model';
import { TaskStore } from '../../store/task.store';

@Component({
  selector: 'app-task-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  store = inject(TaskStore);
  task = input.required<iTask>();

  readonly TASK_STATUS = TASK_STATUS;
}
