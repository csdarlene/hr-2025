import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DepartmentService } from '../../../../core/services/department.service';
import { Department } from '../../../../core/models/department.model';
import { DepartmentDialogComponent } from '../../dialogs/department-dialog/department-dialog.component';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-department-config',
  standalone: true,
  imports: [CommonModule, RouterModule, MatDialogModule, DataTableComponent],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Afdelingen Configuratie</h1>
        <button class="btn-primary" (click)="openDialog()">
          Nieuwe Afdeling
        </button>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6">
        <app-data-table 
          [data]="departments"
          [columns]="columns"
          [showActions]="true"
        >
          <ng-template actions let-department>
            <button class="text-primary-600 hover:text-primary-900 mr-3" (click)="onEdit(department)">
              Bewerken
            </button>
            <button class="text-red-600 hover:text-red-900" (click)="onDelete(department)">
              Verwijderen
            </button>
          </ng-template>
        </app-data-table>
      </div>
    </div>
  `
})
export class DepartmentConfigComponent implements OnInit {
  departments: Department[] = [];
  
  columns = [
    { key: 'id', label: 'ID', type: 'text' },
    { key: 'name', label: 'Naam', type: 'text' },
    { key: 'description', label: 'Beschrijving', type: 'text' }
  ];

  constructor(
    private departmentService: DepartmentService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.departmentService.getDepartments().subscribe(departments => {
      this.departments = departments;
    });
  }

  openDialog(department?: Department) {
    const dialogRef = this.dialog.open(DepartmentDialogComponent, {
      width: '500px',
      data: department || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDepartments();
      }
    });
  }

  onEdit(department: Department) {
    this.openDialog(department);
  }

  onDelete(department: Department) {
    if (confirm(`Weet u zeker dat u de afdeling "${department.name}" wilt verwijderen?`)) {
      this.departmentService.deleteDepartment(department.id).subscribe(() => {
        this.loadDepartments();
      });
    }
  }
}