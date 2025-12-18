import { Component, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { iTask, TASK_STATUS, TaskStatus, TaskFormDialogData, TaskFormDialogResult } from '../../../../core/models/task.model';
import { TaskStore } from '../../store/task.store';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { TaskFormDialogComponent } from '../../../../shared/task-form-dialog/task-form-dialog.component';

@Component({
  selector: 'app-task-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  store = inject(TaskStore);
  dialog = inject(MatDialog);
  task = input.required<iTask>();

  readonly TASK_STATUS = TASK_STATUS;

  onDelete(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Task',
        message: `Are you sure you want to delete "${this.task().title}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.store.deleteTask({ id: this.task().id });
      }
    });
  }

  onTaskEdit(): void {
    const dialogData: TaskFormDialogData = {
      task: this.task(),
      mode: 'edit',
    };

    const dialogRef = this.dialog.open(TaskFormDialogComponent, {
      width: '500px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((result: TaskFormDialogResult | null) => {
      if (result && result.mode === 'edit') {
        this.store.updateTask({ id: result.taskId!, data: result.data });
      }
    });
  }

  onTaskStatusUpdate(status: TaskStatus): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Update Task Status',
        message: `Are you sure you move "${this.task().title}" to ${this.task().status}?`,
        confirmText: 'Update Status',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.store.UpdateTaskStatus({ id: this.task().id, status });
      }
    });
  }
}
