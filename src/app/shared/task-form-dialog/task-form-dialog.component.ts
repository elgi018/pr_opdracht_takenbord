import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskFormDialogData, TaskFormDialogResult } from '../../core/models/task.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
  ],
  templateUrl: './task-form-dialog.component.html',
  styleUrl: './task-form-dialog.component.scss',
})
export class TaskFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<TaskFormDialogComponent>);
  data = inject<TaskFormDialogData>(MAT_DIALOG_DATA);
  taskFormGroup!: FormGroup;

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
    });
  }

  onSubmit(): void {
    if (this.taskFormGroup.invalid) {
      this.taskFormGroup.markAllAsTouched();
      return;
    }

    const result: TaskFormDialogResult = {
      data: this.taskFormGroup.value,
      mode: this.data.mode,
      taskId: this.data.task?.id,
    };

    this.dialogRef.close(result);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
