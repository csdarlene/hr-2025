import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';
import { ProjectService } from '../../../../core/services/project.service';
import { EvaluationService } from '../../../../core/services/evaluation.service';
import { User, UserRole } from '../../../../core/models/user.model';
import { Project, ProjectStatus } from '../../../../core/models/project.model';
import { Evaluation, EvaluationStatus, EvaluationType } from '../../../../core/models/evaluation.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <header class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-1 text-sm text-gray-600">
          Welcome back, {{ authService.currentUser?.firstName }}!
        </p>
      </header>

      <!-- Admin Dashboard -->
      <div *ngIf="authService.isAdmin()">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- Total Projects -->
          <div class="card">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-primary-100 text-primary-800">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="ml-5">
                <p class="text-gray-500 text-sm">Active Projects</p>
                <p class="text-2xl font-semibold text-gray-900">{{ getActiveProjects() }}</p>
              </div>
            </div>
          </div>

          <!-- Total Employees -->
          <div class="card">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-secondary-100 text-secondary-800">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div class="ml-5">
                <p class="text-gray-500 text-sm">Total Employees</p>
                <p class="text-2xl font-semibold text-gray-900">{{ users.length }}</p>
              </div>
            </div>
          </div>

          <!-- Completed Evaluations -->
          <div class="card">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-accent-100 text-accent-800">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div class="ml-5">
                <p class="text-gray-500 text-sm">Completed Evaluations</p>
                <p class="text-2xl font-semibold text-gray-900">{{ getCompletedEvaluations() }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="card hover:shadow-lg transition-shadow cursor-pointer" routerLink="/admin/users">
            <div class="flex items-center mb-4">
              <div class="p-3 rounded-full bg-primary-100 text-primary-800">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold ml-4">User Management</h3>
            </div>
            <p class="text-gray-600">Register and manage user accounts.</p>
          </div>

          <div class="card hover:shadow-lg transition-shadow cursor-pointer" routerLink="/admin">
            <div class="flex items-center mb-4">
              <div class="p-3 rounded-full bg-secondary-100 text-secondary-800">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold ml-4">System Settings</h3>
            </div>
            <p class="text-gray-600">Configure system settings and permissions.</p>
          </div>
        </div>
      </div>

      <!-- HR Dashboard -->
      <div *ngIf="authService.isHR() && !authService.isAdmin()">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- Total Employees -->
          <div class="card">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-primary-100 text-primary-800">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div class="ml-5">
                <p class="text-gray-500 text-sm">Total Employees</p>
                <p class="text-2xl font-semibold text-gray-900">{{ users.length }}</p>
              </div>
            </div>
          </div>
          
          <!-- Active Projects -->
          <div class="card">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-secondary-100 text-secondary-800">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div class="ml-5">
                <p class="text-gray-500 text-sm">Active Projects</p>
                <p class="text-2xl font-semibold text-gray-900">{{ getActiveProjects() }}</p>
              </div>
            </div>
          </div>
          
          <!-- Pending Evaluations -->
          <div class="card">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-accent-100 text-accent-800">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div class="ml-5">
                <p class="text-gray-500 text-sm">Pending Evaluations</p>
                <p class="text-2xl font-semibold text-gray-900">{{ getPendingEvaluations() }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Department Overview -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div class="card">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Department Overview</h2>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projects</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr *ngFor="let dept of getDepartmentStats()">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ dept.name }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ dept.employees }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ dept.projects }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <a [routerLink]="['/reports/departments', dept.id]" class="text-primary-600 hover:text-primary-900">View Details</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Recent Evaluations -->
          <div class="card">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Recent Evaluations</h2>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr *ngFor="let evaluation of evaluations">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ getUserName(evaluation.userId) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ evaluation.type }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ evaluation.date | date:'shortDate' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        [ngClass]="{
                          'bg-yellow-100 text-yellow-800': evaluation.status === EvaluationStatus.DRAFT,
                          'bg-blue-100 text-blue-800': evaluation.status === EvaluationStatus.SUBMITTED || evaluation.status === EvaluationStatus.IN_REVIEW,
                          'bg-green-100 text-green-800': evaluation.status === EvaluationStatus.COMPLETED
                        }">
                        {{ evaluation.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="mt-4">
              <a routerLink="/reports/evaluations" class="text-primary-600 hover:text-primary-900 text-sm font-medium">View all evaluations →</a>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="card hover:shadow-lg transition-shadow cursor-pointer" routerLink="/reports/employees">
            <div class="flex items-center mb-4">
              <div class="p-3 rounded-full bg-primary-100 text-primary-800">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold ml-4">Employee Reports</h3>
            </div>
            <p class="text-gray-600">View detailed employee performance reports and statistics.</p>
          </div>

          <div class="card hover:shadow-lg transition-shadow cursor-pointer" routerLink="/reports/departments">
            <div class="flex items-center mb-4">
              <div class="p-3 rounded-full bg-secondary-100 text-secondary-800">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold ml-4">Department Analytics</h3>
            </div>
            <p class="text-gray-600">Analyze department performance and resource allocation.</p>
          </div>

          <div class="card hover:shadow-lg transition-shadow cursor-pointer" routerLink="/reports/evaluations">
            <div class="flex items-center mb-4">
              <div class="p-3 rounded-full bg-accent-100 text-accent-800">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold ml-4">Evaluation Insights</h3>
            </div>
            <p class="text-gray-600">Review and analyze employee evaluation trends.</p>
          </div>
        </div>
      </div>

      <!-- Team Lead Dashboard -->
      <div *ngIf="authService.isTeamLead() && !authService.isAdmin() && !authService.isHR()">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <!-- Team Members -->
          <div class="card">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">My Team</h2>
            <div class="space-y-4">
              <div *ngFor="let member of getTeamMembers()" class="flex items-center">
                <img [src]="member.profileImage || 'https://randomuser.me/api/portraits/lego/1.jpg'" 
                     alt="Profile" 
                     class="w-10 h-10 rounded-full">
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900">{{ member.firstName }} {{ member.lastName }}</p>
                  <p class="text-sm text-gray-500">{{ member.position }}</p>
                </div>
                <button class="ml-auto text-primary-600 hover:text-primary-900"
                        [routerLink]="['/evaluations/new']"
                        [queryParams]="{userId: member.id}">
                  Evaluate
                </button>
              </div>
            </div>
          </div>

          <!-- Pending Evaluations -->
          <div class="card">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Pending Evaluations</h2>
            <div class="space-y-4">
              <div *ngFor="let evaluation of getPendingTeamEvaluations()" class="flex items-center">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ getUserName(evaluation.userId) }}</p>
                  <p class="text-sm text-gray-500">{{ evaluation.date | date:'shortDate' }}</p>
                </div>
                <span class="ml-auto px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      [ngClass]="{
                        'bg-yellow-100 text-yellow-800': evaluation.status === EvaluationStatus.DRAFT,
                        'bg-blue-100 text-blue-800': evaluation.status === EvaluationStatus.SUBMITTED
                      }">
                  {{ evaluation.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Team Member Dashboard -->
      <div *ngIf="authService.isTeamMember() && !authService.isAdmin() && !authService.isHR() && !authService.isTeamLead()">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- My Evaluations -->
          <div class="card">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">My Evaluations</h2>
            <div class="space-y-4">
              <div *ngFor="let evaluation of getMyEvaluations()" class="flex items-center">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ evaluation.type }} Evaluation</p>
                  <p class="text-sm text-gray-500">{{ evaluation.date | date:'shortDate' }}</p>
                </div>
                <span class="ml-auto px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      [ngClass]="{
                        'bg-yellow-100 text-yellow-800': evaluation.status === EvaluationStatus.DRAFT,
                        'bg-blue-100 text-blue-800': evaluation.status === EvaluationStatus.SUBMITTED,
                        'bg-green-100 text-green-800': evaluation.status === EvaluationStatus.COMPLETED
                      }">
                  {{ evaluation.status }}
                </span>
              </div>
            </div>
            <div class="mt-4">
              <button class="btn-primary" routerLink="/evaluations/new">
                Start New Evaluation
              </button>
            </div>
          </div>

          <!-- My Projects -->
          <div class="card">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">My Projects</h2>
            <div class="space-y-4">
              <div *ngFor="let project of getMyProjects()" class="flex items-center">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ project.name }}</p>
                  <p class="text-sm text-gray-500">{{ project.description }}</p>
                </div>
                <span class="ml-auto px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      [ngClass]="{
                        'bg-green-100 text-green-800': project.status === ProjectStatus.ACTIVE,
                        'bg-yellow-100 text-yellow-800': project.status === ProjectStatus.ON_HOLD,
                        'bg-blue-100 text-blue-800': project.status === ProjectStatus.COMPLETED
                      }">
                  {{ project.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  users: User[] = [];
  projects: Project[] = [];
  evaluations: Evaluation[] = [];
  EvaluationStatus = EvaluationStatus;
  ProjectStatus = ProjectStatus;

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private projectService: ProjectService,
    private evaluationService: EvaluationService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });

    this.projectService.getProjects().subscribe(projects => {
      this.projects = projects;
    });

    this.evaluationService.getAllCriteria().subscribe(() => {
      this.evaluations = [
        {
          id: '1',
          userId: '1',
          projectId: '1',
          departmentId: '1',
          level: 'SENIOR',
          date: new Date('2024-01-15'),
          type: EvaluationType.SELF,
          status: EvaluationStatus.COMPLETED,
          scores: []
        },
        {
          id: '2',
          userId: '2',
          projectId: '1',
          departmentId: '1',
          level: 'SENIOR',
          date: new Date('2024-01-20'),
          type: EvaluationType.TEAM_LEAD,
          status: EvaluationStatus.SUBMITTED,
          scores: []
        }
      ];
    });
  }

  getActiveProjects(): number {
    return this.projects.filter(p => p.status === ProjectStatus.ACTIVE).length;
  }

  getCompletedEvaluations(): number {
    return this.evaluations.filter(e => e.status === EvaluationStatus.COMPLETED).length;
  }

  getPendingEvaluations(): number {
    return this.evaluations.filter(e => 
      e.status === EvaluationStatus.SUBMITTED || 
      e.status === EvaluationStatus.IN_REVIEW
    ).length;
  }

  getDepartmentStats() {
    const departments = [
      { id: '1', name: 'Java', employees: 0, projects: 0 },
      { id: '2', name: 'Apex', employees: 0, projects: 0 },
      { id: '3', name: 'Be Informed', employees: 0, projects: 0 },
      { id: '4', name: 'Business Intelligence', employees: 0, projects: 0 },
      { id: '5', name: 'Office Management', employees: 0, projects: 0 },
      { id: '6', name: 'Delivery Management', employees: 0, projects: 0 },
      { id: '7', name: 'People and Culture', employees: 0, projects: 0 },
      { id: '8', name: 'DBA', employees: 0, projects: 0 }
    ];

    this.users.forEach(user => {
      const dept = departments.find(d => d.id === user.departmentId);
      if (dept) {
        dept.employees++;
      }
    });

    this.projects.forEach(project => {
      const dept = departments.find(d => d.id === project.departmentId);
      if (dept) {
        dept.projects++;
      }
    });

    return departments;
  }

  getUserName(userId: string): string {
    const user = this.users.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown';
  }

  getTeamMembers(): User[] {
    if (!this.authService.currentUser) return [];
    return this.users.filter(user => 
      user.role === UserRole.TEAM_MEMBER && 
      user.projectIds.some(pid => this.authService.currentUser?.projectIds.includes(pid))
    );
  }

  getPendingTeamEvaluations(): Evaluation[] {
    if (!this.authService.currentUser) return [];
    return this.evaluations.filter(e => 
      e.status !== EvaluationStatus.COMPLETED && 
      this.getTeamMembers().some(m => m.id === e.userId)
    );
  }

  getMyEvaluations(): Evaluation[] {
    if (!this.authService.currentUser) return [];
    return this.evaluations.filter(e => e.userId === this.authService.currentUser?.id);
  }

  getMyProjects(): Project[] {
    if (!this.authService.currentUser) return [];
    return this.projects.filter(p => 
      this.authService.currentUser?.projectIds.includes(p.id)
    );
  }
}