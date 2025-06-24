import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CriteriaCategory } from '../../../../core/models/evaluation.model';

@Component({
  selector: 'app-criteria-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './criteria-dialog.component.html',
  styleUrls: ['./criteria-dialog.component.css']
})
export class CriteriaDialogComponent {
  form: FormGroup;
  categories = Object.values(CriteriaCategory);
  levels = ['BOOTCAMPER', 'JUNIOR', 'MEDIOR', 'SENIOR'];
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CriteriaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = !!data;
    this.form = this.fb.group({
      id: [data?.id || ''],
      description: [data?.description || '', Validators.required],
      category: [data?.category || '', Validators.required],
      departmentId: [data?.departmentId || '', Validators.required],
      level: [data?.level || '', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}