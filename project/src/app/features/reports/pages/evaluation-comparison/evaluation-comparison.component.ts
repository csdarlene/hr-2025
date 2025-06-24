import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EvaluationService } from '../../../../core/services/evaluation.service';
import { UserService } from '../../../../core/services/user.service';
import { EvaluationComparison, EvaluationStatus, EvaluationType } from '../../../../core/models/evaluation.model';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-evaluation-comparison',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold">Evaluation Comparison</h1>
          <p class="text-gray-600" *ngIf="employee">
            {{ employee.firstName }} {{ employee.lastName }} - {{ employee.position }}
          </p>
        </div>
        <button class="btn-outline" [routerLink]="['/reports/projects', projectId, 'evaluations']">
          Back to Project Evaluations
        </button>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="space-y-6">
            <div *ngFor="let comparison of comparisons" class="border-b pb-6">
              <div class="mb-4">
                <h3 class="text-lg font-medium text-gray-900">{{ comparison.criteriaDescription }}</h3>
                <p class="text-sm text-gray-500">{{ comparison.category }}</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Self Evaluation -->
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="font-medium text-gray-700 mb-2">Self Evaluation</h4>
                  <div class="text-2xl font-bold text-primary-600 mb-2">
                    {{ comparison.selfScore }}/5
                  </div>
                </div>

                <!-- Team Lead Evaluation -->
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="font-medium text-gray-700 mb-2">Team Lead Evaluation</h4>
                  <div class="text-2xl font-bold text-secondary-600 mb-2">
                    {{ comparison.teamLeadScore }}/5
                  </div>
                </div>

                <!-- Final Score -->
                <div class="bg-gray-50 p-4 rounded-lg" [class.bg-yellow-50]="comparison.difference !== 0">
                  <h4 class="font-medium text-gray-700 mb-2">Final Score</h4>
                  <select 
                    [formControlName]="comparison.criteriaId"
                    class="form-select"
                  >
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Below Average</option>
                    <option value="3">3 - Average</option>
                    <option value="4">4 - Above Average</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                  <div *ngIf="comparison.difference !== 0" class="mt-2 text-sm text-yellow-800">
                    Difference: {{ comparison.difference }} points
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button type="submit" class="btn-primary" [disabled]="!form.valid || saving">
              {{ saving ? 'Saving...' : 'Finalize Evaluation' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class EvaluationComparisonComponent implements OnInit {
  userId: string = '';
  projectId: string = '';
  employee?: User;
  comparisons: EvaluationComparison[] = [];
  form: FormGroup;
  saving = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private evaluationService: EvaluationService,
    private userService: UserService
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.projectId = this.route.snapshot.paramMap.get('projectId') || '';
    
    this.loadData();
  }

  private loadData() {
    this.userService.getUserById(this.userId).subscribe(user => {
      this.employee = user;
    });

    this.evaluationService.getComparisonForUser(this.userId, this.projectId)
      .subscribe(comparisons => {
        this.comparisons = comparisons;
        this.initForm();
      });
  }

  private initForm() {
    this.comparisons.forEach(comparison => {
      this.form.addControl(
        comparison.criteriaId, 
        this.fb.control(comparison.finalScore || Math.round((comparison.selfScore + comparison.teamLeadScore) / 2))
      );
    });
  }

  onSubmit() {
    if (this.form.valid && this.employee) {
      this.saving = true;

      const finalScores = this.comparisons.map(comparison => ({
        criteriaId: comparison.criteriaId,
        score: parseInt(this.form.get(comparison.criteriaId)?.value, 10)
      }));

      const finalEvaluation = {
        userId: this.userId,
        projectId: this.projectId,
        type: EvaluationType.FINAL,
        status: EvaluationStatus.COMPLETED,
        scores: finalScores,
        level: this.employee.level,
        departmentId: this.employee.departmentId,
        date: new Date()
      };

      this.evaluationService.createEvaluation(finalEvaluation).subscribe({
        next: () => {
          this.router.navigate(['/reports/projects', this.projectId, 'evaluations']);
        },
        error: () => {
          this.saving = false;
        }
      });
    }
  }
}