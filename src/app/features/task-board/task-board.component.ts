import { Component, inject, OnInit } from '@angular/core';
import { TaskStore } from './store/task.store';
import { TaskColumnComponent } from './components/task-column/task-column.component';
import {
  iTask,
  TASK_STATUS,
  TaskFormDialogData,
  TaskFormDialogResult,
} from '../../core/models/task.model';
import { MatDialog } from '@angular/material/dialog';
import { TaskFormDialogComponent } from '../../shared/task-form-dialog/task-form-dialog.component';

@Component({
  selector: 'app-task-board',
  imports: [TaskColumnComponent],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.scss',
})
export class TaskBoardComponent implements OnInit {
  readonly store = inject(TaskStore);
  private dialog = inject(MatDialog);

  readonly TASK_STATUS = TASK_STATUS;

  ngOnInit(): void {
    this.store.getTasks();
  }

  onEditTask(task: iTask): void {
    const dialogData: TaskFormDialogData = {
      task,
      mode: 'edit',
    };

    const dialogRef = this.dialog.open(TaskFormDialogComponent, {
      width: '500px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((result: TaskFormDialogResult | null) => {
      if (result && result.mode === 'edit') {
        // Update Task
        this.store.updateTask({ id: result.taskId!, data: result.data });
      }
    });
  }
}
