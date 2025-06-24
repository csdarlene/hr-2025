import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { UserRole, Level } from '../../../../core/models/user.model';

@Component({
  selector: 'app-user-dialog',
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
  template: `
    <div class="p-6">
      <h2 mat-dialog-title class="text-xl font-bold mb-4">
        {{ isEditMode ? 'Gebruiker Bewerken' : 'Nieuwe Gebruiker' }}
      </h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div mat-dialog-content>
          <div class="grid grid-cols-2 gap-4">
            <mat-form-field appearance="outline">
              <mat-label>Voornaam</mat-label>
              <input matInput formControlName="firstName" required>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Achternaam</mat-label>
              <input matInput formControlName="lastName" required>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" required>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Telefoonnummer</mat-label>
              <input matInput formControlName="phoneNumber">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Rol</mat-label>
              <mat-select formControlName="role" required>
                <mat-option *ngFor="let role of roles" [value]="role">
                  {{ getRoleDisplay(role) }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Niveau</mat-label>
              <mat-select formControlName="level" required>
                <mat-option *ngFor="let level of levels" [value]="level">
                  {{ level }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Afdeling</mat-label>
              <mat-select formControlName="departmentId" required>
                <mat-option *ngFor="let dept of departments" [value]="dept.id">
                  {{ dept.name }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Functie</mat-label>
              <input matInput formControlName="position" required>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Profielfoto URL</mat-label>
            <input matInput formControlName="profileImage" placeholder="https://...">
          </mat-form-field>
        </div>

        <div mat-dialog-actions class="flex justify-end gap-2">
          <button mat-button type="button" (click)="onCancel()">Annuleren</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!form.valid">
            {{ isEditMode ? 'Opslaan' : 'Aanmaken' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class UserDialogComponent {
  form: FormGroup;
  isEditMode: boolean;
  roles = Object.values(UserRole);
  levels = Object.values(Level);
  departments = [
    { id: '1', name: 'Java' },
    { id: '2', name: 'Apex' },
    { id: '3', name: 'Be Informed' },
    { id: '4', name: 'Business Intelligence' },
    { id: '5', name: 'Office Management' },
    { id: '6', name: 'Delivery Management' },
    { id: '7', name: 'People and Culture' },
    { id: '8', name: 'DBA' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = !!data;
    this.form = this.fb.group({
      firstName: [data?.firstName || '', Validators.required],
      lastName: [data?.lastName || '', Validators.required],
      email: [data?.email || '', [Validators.required, Validators.email]],
      phoneNumber: [data?.phoneNumber || ''],
      role: [data?.role || '', Validators.required],
      level: [data?.level || '', Validators.required],
      departmentId: [data?.departmentId || '', Validators.required],
      position: [data?.position || '', Validators.required],
      profileImage: [data?.profileImage || ''],
      startDate: [data?.startDate || new Date()],
      projectIds: [data?.projectIds || []]
    });
  }

  getRoleDisplay(role: string): string {
    const roleMap: { [key: string]: string } = {
      'ADMIN': 'Administrator',
      'HR': 'HR Manager',
      'MANAGEMENT': 'Management',
      'TEAM_LEAD': 'Team Lead',
      'TEAM_MEMBER': 'Team Member'
    };
    return roleMap[role] || role;
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