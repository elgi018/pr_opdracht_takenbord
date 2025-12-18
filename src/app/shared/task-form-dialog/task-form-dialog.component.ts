import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  TASK_STATUS,
  TASK_STATUS_VALUES,
  TaskFormDialogData,
  TaskFormDialogResult,
  TaskStatus,
} from '../../core/models/task.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-task-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './task-form-dialog.component.html',
  styleUrl: './task-form-dialog.component.scss',
})
export class TaskFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<TaskFormDialogComponent>);
  data = inject<TaskFormDialogData>(MAT_DIALOG_DATA);
  taskFormGroup!: FormGroup;
  readonly statusOptions: readonly TaskStatus[] = TASK_STATUS_VALUES;

  get isEditMode(): boolean {
    return this.data.mode === 'edit';
  }
  get dialogTitle(): string {
    return this.isEditMode ? 'Edit Task' : 'New Task';
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    const task = this.data.task;

    this.taskFormGroup = this.fb.group({
      title: [task?.title || '', [Validators.required, Validators.minLength(3)]],
      description: [task?.description || '', [Validators.required, Validators.minLength(10)]],
      status: [
        { value: task?.status || TASK_STATUS.TODO, disabled: !this.isEditMode },
        [Validators.required],
      ],
    });
  }

  onSubmit(): void {
    if (this.taskFormGroup.invalid) {
      this.taskFormGroup.markAllAsTouched();
      return;
    }

    const result: TaskFormDialogResult = {
      data: this.taskFormGroup.getRawValue(),
      mode: this.data.mode,
      taskId: this.data.task?.id,
    };

    this.dialogRef.close(result);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
