import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { iTask } from '../../../../core/models/task.model';

@Component({
  selector: 'app-task-card',
  imports: [MatCardModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  task = input.required<iTask>();
}
