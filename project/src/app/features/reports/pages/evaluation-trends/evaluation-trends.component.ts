import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EvaluationService } from '../../../../core/services/evaluation.service';
import { UserService } from '../../../../core/services/user.service';
import { DepartmentService } from '../../../../core/services/department.service';
import { Evaluation, EvaluationStatus } from '../../../../core/models/evaluation.model';
import { Department } from '../../../../core/models/department.model';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-evaluation-trends',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Evaluation Trends</h1>
        <button class="btn-outline" routerLink="/reports">Back to Reports</button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Overall Statistics -->
        <div class="card">
          <h2 class="text-xl font-semibold mb-4">Overall Statistics</h2>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-sm text-gray-500">Total Evaluations</p>
              <p class="text-2xl font-semibold">{{ evaluations.length }}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-sm text-gray-500">Completion Rate</p>
              <p class="text-2xl font-semibold">{{ getCompletionRate() | percent }}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-sm text-gray-500">Average Score</p>
              <p class="text-2xl font-semibold">{{ getAverageScore() | number:'1.1-1' }}/5</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-sm text-gray-500">Pending Reviews</p>
              <p class="text-2xl font-semibold">{{ getPendingReviews() }}</p>
            </div>
          </div>
        </div>

        <!-- Department Performance -->
        <div class="card">
          <h2 class="text-xl font-semibold mb-4">Department Performance</h2>
          <div class="space-y-4">
            <div *ngFor="let dept of departments" class="flex items-center">
              <span class="w-32">{{ dept.name }}</span>
              <div class="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-primary-500"
                  [style.width.%]="getDepartmentCompletionRate(dept) * 100"
                ></div>
              </div>
              <span class="ml-2">{{ getDepartmentCompletionRate(dept) | percent }}</span>
            </div>
          </div>
        </div>

        <!-- Recent Evaluations -->
        <div class="card">
          <h2 class="text-xl font-semibold mb-4">Recent Evaluations</h2>
          <div class="space-y-4">
            <div *ngFor="let evaluation of getRecentEvaluations()" class="flex items-center justify-between">
              <div>
                <p class="font-medium">{{ getUserName(evaluation.userId) }}</p>
                <p class="text-sm text-gray-500">{{ evaluation.date | date:'shortDate' }}</p>
              </div>
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                [ngClass]="{
                  'bg-green-100 text-green-800': evaluation.status === 'COMPLETED',
                  'bg-yellow-100 text-yellow-800': evaluation.status === 'IN_REVIEW',
                  'bg-blue-100 text-blue-800': evaluation.status === 'SUBMITTED'
                }">
                {{ evaluation.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- Evaluation Status Distribution -->
        <div class="card">
          <h2 class="text-xl font-semibold mb-4">Status Distribution</h2>
          <div class="space-y-4">
            <div *ngFor="let status of evaluationStatuses" class="flex items-center">
              <span class="w-32">{{ status }}</span>
              <div class="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  class="h-full"
                  [ngClass]="{
                    'bg-green-500': status === 'COMPLETED',
                    'bg-yellow-500': status === 'IN_REVIEW',
                    'bg-blue-500': status === 'SUBMITTED',
                    'bg-gray-500': status === 'DRAFT'
                  }"
                  [style.width.%]="getStatusPercentage(status)"
                ></div>
              </div>
              <span class="ml-2">{{ getStatusCount(status) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EvaluationTrendsComponent implements OnInit {
  evaluations: Evaluation[] = [];
  departments: Department[] = [];
  users: User[] = [];
  evaluationStatuses = Object.values(EvaluationStatus);

  constructor(
    private evaluationService: EvaluationService,
    private userService: UserService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.departmentService.getDepartments().subscribe(departments => {
      this.departments = departments;
    });

    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });

    this.evaluationService.getAllCriteria().subscribe(() => {
      // Get evaluations from the service
      this.evaluations = [];
    });
  }

  getCompletionRate(): number {
    if (this.evaluations.length === 0) return 0;
    return this.evaluations.filter(e => e.status === EvaluationStatus.COMPLETED).length / this.evaluations.length;
  }

  getAverageScore(): number {
    const completedEvals = this.evaluations.filter(e => e.status === EvaluationStatus.COMPLETED);
    if (completedEvals.length === 0) return 0;

    const totalScore = completedEvals.reduce((sum, evaluation) => {
      const evalScores = evaluation.scores.map(s => s.score);
      return sum + (evalScores.reduce((a, b) => a + b, 0) / evalScores.length);
    }, 0);

    return totalScore / completedEvals.length;
  }

  getPendingReviews(): number {
    return this.evaluations.filter(e => e.status === EvaluationStatus.IN_REVIEW).length;
  }

  getDepartmentCompletionRate(dept: Department): number {
    const deptEvals = this.evaluations.filter(e => e.departmentId === dept.id);
    if (deptEvals.length === 0) return 0;
    return deptEvals.filter(e => e.status === EvaluationStatus.COMPLETED).length / deptEvals.length;
  }

  getRecentEvaluations(): Evaluation[] {
    return this.evaluations
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
  }

  getUserName(userId: string): string {
    const user = this.users.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown';
  }

  getStatusCount(status: string): number {
    return this.evaluations.filter(e => e.status === status).length;
  }

  getStatusPercentage(status: string): number {
    if (this.evaluations.length === 0) return 0;
    return (this.getStatusCount(status) / this.evaluations.length) * 100;
  }
}