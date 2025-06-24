import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { EvaluationService } from '../../../../core/services/evaluation.service';
import { AuthService } from '../../../../core/services/auth.service';
import { EvaluationType, EvaluationStatus, EvaluationCriteria, CriteriaCategory } from '../../../../core/models/evaluation.model';

@Component({
  selector: 'app-evaluation-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatRadioModule
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-lg">
          <!-- Form Header -->
          <div class="p-6 border-b border-gray-200">
            <h1 class="text-2xl font-bold text-gray-900">Beoordeling Java Bootcampers</h1>
            
            <!-- Basic Information -->
            <div class="mt-6 grid grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700">Ingevuld voor</label>
                <p class="mt-1 text-lg">{{ authService.currentUser?.firstName }} {{ authService.currentUser?.lastName }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Datum</label>
                <p class="mt-1 text-lg">{{ currentDate | date:'dd-MM-yyyy' }}</p>
              </div>
            </div>
          </div>

          <!-- Evaluation Form -->
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="p-6">
              <!-- Criteria Categories -->
              <div *ngFor="let category of categories" class="mb-8">
                <h2 class="text-xl font-semibold mb-4">{{ getCategoryDisplay(category) }}</h2>
                
                <div class="space-y-6">
                  <div *ngFor="let criteria of getCriteriaByCategoryAndLevel(category)" class="bg-gray-50 p-4 rounded-lg">
                    <div class="mb-4">
                      <h3 class="text-lg font-medium text-gray-900">{{ criteria.description }}</h3>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <!-- Score Selection -->
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Score (1-5)</label>
                        <div class="flex space-x-4">
                          <label *ngFor="let score of [1,2,3,4,5]" class="flex items-center">
                            <input 
                              type="radio" 
                              [formControlName]="criteria.id" 
                              [value]="score"
                              class="form-radio h-4 w-4 text-primary-600"
                            >
                            <span class="ml-2">{{ score }}</span>
                          </label>
                        </div>
                      </div>

                      <!-- Comments -->
                      <div>
                        <mat-form-field appearance="outline" class="w-full">
                          <mat-label>Toelichting</mat-label>
                          <textarea 
                            matInput 
                            [formControlName]="criteria.id + '_comments'"
                            rows="2"
                            placeholder="Voeg een toelichting toe..."
                          ></textarea>
                        </mat-form-field>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button 
                type="button" 
                class="btn-outline"
                routerLink="/evaluations"
              >
                Annuleren
              </button>
              <button 
                type="submit" 
                class="btn-primary"
                [disabled]="!form.valid || submitting"
              >
                {{ submitting ? 'Bezig met opslaan...' : 'Opslaan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class EvaluationFormComponent implements OnInit {
  form: FormGroup;
  evaluationCriteria: EvaluationCriteria[] = [];
  submitting = false;
  currentDate = new Date();
  categories = Object.values(CriteriaCategory);

  constructor(
    private fb: FormBuilder,
    private evaluationService: EvaluationService,
    public authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit() {
    if (this.authService.currentUser) {
      this.evaluationService.getCriteria(
        this.authService.currentUser.departmentId,
        this.authService.currentUser.level
      ).subscribe(criteria => {
        this.evaluationCriteria = criteria;
        this.initForm();
      });
    }
  }

  getCategoryDisplay(category: string): string {
    switch (category) {
      case CriteriaCategory.TASKS_AND_RESPONSIBILITIES:
        return 'Taken en Bevoegdheden';
      case CriteriaCategory.PERSONAL_TRAITS:
        return 'Benodigde Persoonlijke Eigenschappen/Competenties';
      case CriteriaCategory.TOOLS_AND_METHODOLOGIES:
        return 'Benodigde Tools/Methodieken';
      case CriteriaCategory.JOB_REQUIREMENTS:
        return 'Functie-eisen/Opleiding';
      case CriteriaCategory.WORK_EXPERIENCE:
        return 'Werkervaring';
      default:
        return category;
    }
  }

  getCriteriaByCategoryAndLevel(category: string): EvaluationCriteria[] {
    return this.evaluationCriteria.filter(c => c.category === category);
  }

  private initForm() {
    this.evaluationCriteria.forEach(criteria => {
      this.form.addControl(criteria.id, this.fb.control('', Validators.required));
      this.form.addControl(criteria.id + '_comments', this.fb.control(''));
    });
  }

  onSubmit() {
    if (this.form.valid && this.authService.currentUser) {
      this.submitting = true;

      const scores = this.evaluationCriteria.map(criteria => ({
        criteriaId: criteria.id,
        score: this.form.get(criteria.id)?.value,
        comments: this.form.get(criteria.id + '_comments')?.value
      }));

      const evaluation = {
        userId: this.authService.currentUser.id,
        projectId: this.authService.currentUser.projectIds[0],
        departmentId: this.authService.currentUser.departmentId,
        level: this.authService.currentUser.level,
        date: new Date(),
        type: EvaluationType.SELF,
        status: EvaluationStatus.SUBMITTED,
        scores
      };

      this.evaluationService.createEvaluation(evaluation).subscribe({
        next: () => {
          this.router.navigate(['/evaluations']);
        },
        error: () => {
          this.submitting = false;
        }
      });
    }
  }
}