import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { ProjectStatus } from '../../../../core/models/project.model';
import { DEPARTMENTS } from '../../../../core/models/department.model';
import { UserService } from '../../../../core/services/user.service';
import { User, UserRole } from '../../../../core/models/user.model';

@Component({
  selector: 'app-project-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule
  ],
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.css']
})
export class ProjectDialogComponent {
  form: FormGroup;
  statuses = Object.values(ProjectStatus);
  departments = DEPARTMENTS;
  teamLeads: User[] = [];
  teamMembers: User[] = [];
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProjectDialogComponent>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = !!data;
    this.form = this.fb.group({
      name: [data?.name || '', Validators.required],
      description: [data?.description || '', Validators.required],
      teamLeadId: [data?.teamLeadId || '', Validators.required],
      teamMemberIds: [data?.teamMemberIds || []],
      startDate: [data?.startDate || new Date(), Validators.required],
      endDate: [data?.endDate || null],
      departmentId: [data?.departmentId || '', Validators.required],
      status: [data?.status || ProjectStatus.ACTIVE, Validators.required]
    });

    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(users => {
      this.teamLeads = users.filter(user => 
        user.role === UserRole.TEAM_LEAD || user.role === UserRole.ADMIN
      );
      this.teamMembers = users.filter(user => 
        user.role === UserRole.TEAM_MEMBER
      );
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