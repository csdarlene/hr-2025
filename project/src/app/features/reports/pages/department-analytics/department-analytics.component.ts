import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DepartmentService } from '../../../../core/services/department.service';
import { UserService } from '../../../../core/services/user.service';
import { EvaluationService } from '../../../../core/services/evaluation.service';
import { Department } from '../../../../core/models/department.model';
import { User, Level } from '../../../../core/models/user.model';
import { Evaluation } from '../../../../core/models/evaluation.model';

@Component({
  selector: 'app-department-analytics',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Department Analytics</h1>
        <button class="btn-outline" routerLink="/reports">Back to Reports</button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div *ngFor="let dept of departments" class="card">
          <h2 class="text-xl font-semibold mb-4">{{ dept.name }}</h2>
          
          <div class="space-y-4">
            <!-- Department Statistics -->
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-sm text-gray-500">Total Employees</p>
                <p class="text-2xl font-semibold">{{ getDepartmentEmployeeCount(dept) }}</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-sm text-gray-500">Avg Evaluation Score</p>
                <p class="text-2xl font-semibold">{{ getDepartmentAverageScore(dept) | number:'1.1-1' }}/5</p>
              </div>
            </div>

            <!-- Level Distribution -->
            <div>
              <h3 class="text-lg font-medium mb-2">Level Distribution</h3>
              <div class="space-y-2">
                <div *ngFor="let level of levels" class="flex items-center">
                  <span class="w-24 text-sm">{{ level }}</span>
                  <div class="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      class="h-full bg-primary-500"
                      [style.width.%]="getLevelPercentage(dept, level)"
                    ></div>
                  </div>
                  <span class="ml-2 text-sm">{{ getLevelCount(dept, level) }}</span>
                </div>
              </div>
            </div>

            <!-- Recent Evaluations -->
            <div>
              <h3 class="text-lg font-medium mb-2">Recent Evaluations</h3>
              <div class="space-y-2">
                <div *ngFor="let evaluation of getDepartmentEvaluations(dept)" class="flex items-center justify-between">
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
          </div>
        </div>
      </div>
    </div>
  `
})
export class DepartmentAnalyticsComponent implements OnInit {
  departments: Department[] = [];
  users: User[] = [];
  evaluations: Evaluation[] = [];
  levels = Object.values(Level);

  constructor(
    private departmentService: DepartmentService,
    private userService: UserService,
    private evaluationService: EvaluationService
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

  getDepartmentEmployeeCount(dept: Department): number {
    return this.users.filter(u => u.departmentId === dept.id).length;
  }

  getDepartmentAverageScore(dept: Department): number {
    const deptEvals = this.evaluations.filter(e => e.departmentId === dept.id);
    if (deptEvals.length === 0) return 0;

    const totalScore = deptEvals.reduce((sum, evaluation) => {
      const evalScores = evaluation.scores.map(s => s.score);
      return sum + (evalScores.reduce((a, b) => a + b, 0) / evalScores.length);
    }, 0);

    return totalScore / deptEvals.length;
  }

  getLevelCount(dept: Department, level: string): number {
    return this.users.filter(u => u.departmentId === dept.id && u.level === level).length;
  }

  getLevelPercentage(dept: Department, level: string): number {
    const totalEmployees = this.getDepartmentEmployeeCount(dept);
    if (totalEmployees === 0) return 0;
    return (this.getLevelCount(dept, level) / totalEmployees) * 100;
  }

  getDepartmentEvaluations(dept: Department): Evaluation[] {
    return this.evaluations
      .filter(e => e.departmentId === dept.id)
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
  }

  getUserName(userId: string): string {
    const user = this.users.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown';
  }
}