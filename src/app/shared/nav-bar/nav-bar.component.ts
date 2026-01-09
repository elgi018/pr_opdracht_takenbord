import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TaskSummaryComponent } from '../../features/task-summary/task-summary.component';
import { TaskStore } from '../../core/store/task.store';
import { MatDialog } from '@angular/material/dialog';
import {
  CreateTaskDto,
  TaskFormDialogData,
  TaskFormDialogResult,
} from '../../core/models/task.model';
import { TaskFormDialogComponent } from '../task-form-dialog/task-form-dialog.component';

@Component({
  selector: 'app-nav-bar',
  imports: [MatButtonModule, MatIconModule, TaskSummaryComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit {
  private dialog = inject(MatDialog);
  readonly store = inject(TaskStore);

  ngOnInit(): void {}

  onNewTask(): void {
    const dialogData: TaskFormDialogData = {
      mode: 'create',
    };

    const dialogRef = this.dialog.open(TaskFormDialogComponent, {
      width: '500px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((result: TaskFormDialogResult | null) => {
      if (result && result.mode === 'create') {
        // Create new task
        this.store.createNewTask(result.data as CreateTaskDto);
        // Show Snackbar
      }
    });
  }
}
