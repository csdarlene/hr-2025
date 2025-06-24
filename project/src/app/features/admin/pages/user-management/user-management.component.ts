import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { UserDialogComponent } from '../../dialogs/user-dialog/user-dialog.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, RouterModule, MatDialogModule, DataTableComponent],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Gebruikersbeheer</h1>
        <button class="btn-primary" (click)="openDialog()">
          Nieuwe Gebruiker
        </button>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6">
        <app-data-table 
          [data]="users"
          [columns]="columns"
          [showActions]="true"
          (edit)="onEdit($event)"
          (delete)="onDelete($event)"
        >
        </app-data-table>
      </div>
    </div>
  `
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  
  columns = [
    { key: 'firstName', label: 'Voornaam', type: 'text' },
    { key: 'lastName', label: 'Achternaam', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'role', label: 'Rol', type: 'role' },
    { key: 'level', label: 'Niveau', type: 'level' },
    { key: 'departmentId', label: 'Afdeling', type: 'department' }
  ];

  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  openDialog(user?: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '600px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (user) {
          this.userService.updateUser(user.id, result).subscribe(() => {
            this.loadUsers();
          });
        } else {
          this.userService.createUser(result).subscribe(() => {
            this.loadUsers();
          });
        }
      }
    });
  }

  onEdit(user: User) {
    this.openDialog(user);
  }

  onDelete(user: User) {
    if (confirm(`Weet u zeker dat u de gebruiker "${user.firstName} ${user.lastName}" wilt verwijderen?`)) {
      // Implement delete functionality
      this.loadUsers();
    }
  }
}