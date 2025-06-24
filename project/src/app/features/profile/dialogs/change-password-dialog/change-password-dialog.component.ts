import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <div class="p-6">
      <h2 mat-dialog-title class="text-xl font-bold mb-4">Change Password</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div mat-dialog-content>
          <div class="space-y-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Current Password</mat-label>
              <input 
                matInput 
                type="password" 
                formControlName="currentPassword"
                required
              >
              <mat-error *ngIf="form.get('currentPassword')?.hasError('required')">
                Current password is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>New Password</mat-label>
              <input 
                matInput 
                type="password" 
                formControlName="newPassword"
                required
              >
              <mat-error *ngIf="form.get('newPassword')?.hasError('required')">
                New password is required
              </mat-error>
              <mat-error *ngIf="form.get('newPassword')?.hasError('minlength')">
                Password must be at least 8 characters
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Confirm New Password</mat-label>
              <input 
                matInput 
                type="password" 
                formControlName="confirmPassword"
                required
              >
              <mat-error *ngIf="form.get('confirmPassword')?.hasError('required')">
                Password confirmation is required
              </mat-error>
              <mat-error *ngIf="form.hasError('mismatch')">
                Passwords do not match
              </mat-error>
            </mat-form-field>
          </div>

          <div *ngIf="error" class="mt-4 p-3 bg-red-50 text-red-800 rounded-md">
            {{ error }}
          </div>
        </div>

        <div mat-dialog-actions class="flex justify-end gap-2 mt-4">
          <button mat-button type="button" (click)="onCancel()">Cancel</button>
          <button 
            mat-raised-button 
            color="primary" 
            type="submit"
            [disabled]="!form.valid || loading"
          >
            {{ loading ? 'Updating...' : 'Update Password' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class ChangePasswordDialogComponent {
  form: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.error = '';

      this.authService.updatePassword(
        this.form.get('currentPassword')?.value,
        this.form.get('newPassword')?.value
      ).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.error = 'Failed to update password. Please try again.';
          this.loading = false;
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}