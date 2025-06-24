import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EvaluationService } from '../../../../core/services/evaluation.service';
import { CriteriaCategory } from '../../../../core/models/evaluation.model';
import { CriteriaDialogComponent } from '../../dialogs/criteria-dialog/criteria-dialog.component';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-criteria-config',
  standalone: true,
  imports: [CommonModule, RouterModule, MatDialogModule, DataTableComponent],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Evaluatiecriteria Configuratie</h1>
        <button class="btn-primary" (click)="openDialog()">
          Nieuw Criterium
        </button>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6">
        <app-data-table 
          [data]="criteria"
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
export class CriteriaConfigComponent implements OnInit {
  criteria: any[] = [];
  
  columns = [
    { key: 'id', label: 'ID', type: 'text' },
    { key: 'description', label: 'Beschrijving', type: 'text' },
    { key: 'category', label: 'Categorie', type: 'category' },
    { key: 'level', label: 'Niveau', type: 'level' }
  ];

  constructor(
    private evaluationService: EvaluationService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadCriteria();
  }

  loadCriteria() {
    this.evaluationService.getAllCriteria().subscribe(criteria => {
      this.criteria = criteria;
    });
  }

  openDialog(criteria?: any) {
    const dialogRef = this.dialog.open(CriteriaDialogComponent, {
      width: '600px',
      data: criteria
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (criteria) {
          this.evaluationService.updateCriteria(criteria.id, result).subscribe(() => {
            this.loadCriteria();
          });
        } else {
          this.evaluationService.createCriteria(result).subscribe(() => {
            this.loadCriteria();
          });
        }
      }
    });
  }

  onEdit(criteria: any) {
    this.openDialog(criteria);
  }

  onDelete(criteria: any) {
    if (confirm('Weet u zeker dat u dit criterium wilt verwijderen?')) {
      this.evaluationService.deleteCriteria(criteria.id).subscribe(() => {
        this.loadCriteria();
      });
    }
  }
}