import { Component, Input, Output, EventEmitter, OnInit, ViewChild, AfterViewInit, ContentChild, TemplateRef, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, Sort, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent, MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
  ],
  template: `
    <div class="mat-elevation-z8">
      <table mat-table [dataSource]="dataSource" matSort class="w-full">
        <ng-container *ngFor="let column of columns" [matColumnDef]="column.key">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> {{column.label}} </th>
          <td mat-cell *matCellDef="let element"> 
            <ng-container [ngSwitch]="column.type">
              <span *ngSwitchCase="'date'">{{element[column.key] | date}}</span>
              <span *ngSwitchCase="'status'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                [ngClass]="getStatusClass(element[column.key])">
                {{element[column.key]}}
              </span>
              <span *ngSwitchCase="'role'">{{getRoleDisplay(element[column.key])}}</span>
              <span *ngSwitchCase="'level'">{{getLevelDisplay(element[column.key])}}</span>
              <span *ngSwitchCase="'category'">{{getCategoryDisplay(element[column.key])}}</span>
              <span *ngSwitchCase="'teamLead'">{{element[column.key]}}</span>
              <span *ngSwitchCase="'department'">{{getDepartmentName(element[column.key])}}</span>
              <span *ngSwitchDefault>{{element[column.key]}}</span>
            </ng-container>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions" *ngIf="showActions">
          <th mat-header-cell *matHeaderCellDef class="w-32">Acties</th>
          <td mat-cell *matCellDef="let element" class="w-32">
            <ng-container *ngTemplateOutlet="actionsTemplate || defaultActionsTemplate; context: { $implicit: element }">
            </ng-container>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <mat-paginator 
        [pageSizeOptions]="[5, 10, 25, 100]"
        [pageSize]="10">
      </mat-paginator>
    </div>

    <ng-template #defaultActionsTemplate let-element>
      <div class="flex space-x-2">
        <button class="text-primary-600 hover:text-primary-900" (click)="onEdit(element)">
          Bewerken
        </button>
        <button class="text-red-600 hover:text-red-900" (click)="onDelete(element)">
          Verwijderen
        </button>
      </div>
    </ng-template>
  `,
  styles: [`
    .mat-elevation-z8 {
      background: white;
      border-radius: 8px;
      overflow: hidden;
    }

    .mat-mdc-row:hover {
      background: whitesmoke;
    }

    .mat-mdc-header-cell {
      font-weight: bold;
      color: #7c0506;
    }

    .mat-mdc-cell {
      padding: 16px 8px;
    }
  `]
})
export class DataTableComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() data: any[] = [];
  @Input() columns: { key: string; label: string; type?: string }[] = [];
  @Input() showActions = false;
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() sortChange = new EventEmitter<Sort>();
  @Output() pageChange = new EventEmitter<PageEvent>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ContentChild('actions') actionsTemplate!: TemplateRef<any>;

  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = [];

  ngOnInit() {
    this.initializeDataSource();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && !changes['data'].firstChange) {
      this.initializeDataSource();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  private initializeDataSource() {
    this.dataSource = new MatTableDataSource(this.data);
    this.displayedColumns = this.columns.map(col => col.key);
    if (this.showActions) {
      this.displayedColumns.push('actions');
    }
  }

  onEdit(element: any) {
    this.edit.emit(element);
  }

  onDelete(element: any) {
    this.delete.emit(element);
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'submitted':
        return 'bg-primary-100 text-primary-800';
      case 'in_review':
        return 'bg-secondary-100 text-secondary-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getRoleDisplay(role: string): string {
    const roleMap: { [key: string]: string } = {
      'ADMIN': 'Administrator',
      'HR': 'HR Manager',
      'TEAM_LEAD': 'Team Lead',
      'TEAM_MEMBER': 'Team Member'
    };
    return roleMap[role] || role;
  }

  getLevelDisplay(level: string): string {
    const levelMap: { [key: string]: string } = {
      'BOOTCAMPER': 'Bootcamper',
      'JUNIOR': 'Junior',
      'MEDIOR': 'Medior',
      'SENIOR': 'Senior'
    };
    return levelMap[level] || level;
  }

  getCategoryDisplay(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'TakenEnBevoegheden': 'Taken en Bevoegdheden',
      'BenodigdePersoonlijkeEigenschappen/Competenties': 'Persoonlijke Eigenschappen',
      'BenodigdeTools/Methodieken': 'Tools en Methodieken',
      'Functie-eisen/Opleiding': 'Functie-eisen',
      'Werkervaring': 'Werkervaring'
    };
    return categoryMap[category] || category;
  }

  getDepartmentName(departmentId: string): string {
    const departmentMap: { [key: string]: string } = {
      '1': 'Java',
      '2': 'Apex',
      '3': 'Be Informed',
      '4': 'Business Intelligence',
      '5': 'Office Management',
      '6': 'Delivery Management',
      '7': 'People and Culture',
      '8': 'DBA'
    };
    return departmentMap[departmentId] || 'Unknown';
  }
}