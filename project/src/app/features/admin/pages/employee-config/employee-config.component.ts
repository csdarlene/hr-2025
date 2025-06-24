import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';
import { EmployeeDialogComponent } from '../../dialogs/employee-dialog/employee-dialog.component';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-employee-config',
  standalone: true,
  imports: [CommonModule, RouterModule, MatDialogModule, DataTableComponent, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Werknemers</h1>
        <button class="btn-primary" (click)="openDialog()">
          Nieuwe Werknemer
        </button>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6">
        <app-data-table 
          [data]="users"
          [columns]="columns"
          [showActions]="true"
        >
          <ng-template #actions let-user>
            <button class="text-primary-600 hover:text-primary-900 mr-3" (click)="onEdit(user)">
              Bewerken
            </button>
            <button class="text-red-600 hover:text-red-900" (click)="onDelete(user)">
              Verwijderen
            </button>
          </ng-template>
        </app-data-table>
      </div>
    </div>
  `
})
export class EmployeeConfigComponent implements OnInit {
  users: User[] = [];
  
  columns = [
    { key: 'firstName', label: 'Voornaam', type: 'text' },
    { key: 'lastName', label: 'Achternaam', type: 'text' },
    { key: 'email', label: 'E-mail', type: 'text' },
    { key: 'role', label: 'Rol', type: 'role' },
    { key: 'position', label: 'Functie', type: 'text' },
    { key: 'level', label: 'Niveau', type: 'level' }
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
    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      width: '800px',
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
    if (confirm('Weet u zeker dat u deze werknemer wilt verwijderen?')) {
      // Implement delete functionality
      this.loadUsers();
    }
  }
}