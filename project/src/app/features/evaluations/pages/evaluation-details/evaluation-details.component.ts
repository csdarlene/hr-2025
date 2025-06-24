import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { EvaluationService } from '../../../../core/services/evaluation.service';
import { Evaluation } from '../../../../core/models/evaluation.model';

@Component({
  selector: 'app-evaluation-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">Evaluatie Details</h1>
          <button class="btn-outline" routerLink="/evaluations">
            Terug naar Overzicht
          </button>
        </div>

        <div class="bg-white rounded-lg shadow-lg p-6">
          <div *ngIf="evaluation" class="space-y-6">
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p class="text-sm text-gray-500">Datum</p>
                <p class="text-lg">{{ evaluation.date | date }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Type</p>
                <p class="text-lg">{{ evaluation.type }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Status</p>
                <p class="text-lg">{{ evaluation.status }}</p>
              </div>
            </div>

            <div *ngFor="let score of evaluation.scores" class="border-t pt-4">
              <h3 class="text-lg font-medium mb-2">{{ getCriteriaDescription(score.criteriaId) }}</h3>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Score</p>
                  <p class="text-lg">{{ score.score }}/5</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Toelichting</p>
                  <p class="text-lg">{{ score.comments || 'Geen toelichting' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EvaluationDetailsComponent implements OnInit {
  evaluation?: Evaluation;
  criteriaMap: { [key: string]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private evaluationService: EvaluationService
  ) {}

  ngOnInit() {
    this.loadCriteria();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.evaluationService.getEvaluationById(id).subscribe(evaluation => {
        this.evaluation = evaluation;
      });
    }
  }

  private loadCriteria() {
    this.evaluationService.getAllCriteria().subscribe(criteria => {
      criteria.forEach(c => {
        this.criteriaMap[c.id] = c.description;
      });
    });
  }

  getCriteriaDescription(criteriaId: string): string {
    return this.criteriaMap[criteriaId] || 'Unknown Criteria';
  }
}