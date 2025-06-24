import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectService } from '../../../../core/services/project.service';
import { Project, ProjectStatus } from '../../../../core/models/project.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-8">Reports & Analytics</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Projects Overview -->
        <div class="card">
          <h2 class="text-xl font-semibold mb-4">Active Projects</h2>
          <div class="space-y-4">
            <div *ngFor="let project of activeProjects" class="flex items-center justify-between">
              <div>
                <h3 class="font-medium">{{ project.name }}</h3>
                <p class="text-sm text-gray-500">{{ project.description }}</p>
              </div>
              <button 
                class="text-primary-600 hover:text-primary-900"
                [routerLink]="['/reports/projects', project.id, 'evaluations']"
              >
                View Evaluations
              </button>
            </div>
          </div>
        </div>

        <!-- Department Analytics -->
        <div class="card hover:shadow-lg transition-shadow cursor-pointer" routerLink="/reports/departments">
          <div class="flex items-center mb-4">
            <div class="p-3 rounded-full bg-secondary-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold ml-4">Department Analytics</h2>
          </div>
          <p class="text-gray-600">View performance metrics and trends by department.</p>
        </div>

        <!-- Evaluation Trends -->
        <div class="card hover:shadow-lg transition-shadow cursor-pointer" routerLink="/reports/trends">
          <div class="flex items-center mb-4">
            <div class="p-3 rounded-full bg-accent-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold ml-4">Evaluation Trends</h2>
          </div>
          <p class="text-gray-600">Analyze evaluation patterns and progress over time.</p>
        </div>
      </div>
    </div>
  `
})
export class ReportsComponent {
  activeProjects: Project[] = [];

  constructor(private projectService: ProjectService) {
    this.projectService.getProjects().subscribe(projects => {
      this.activeProjects = projects.filter(p => p.status === ProjectStatus.ACTIVE);
    });
  }
}