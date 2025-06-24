import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ProjectService } from '../../../../core/services/project.service';
import { UserService } from '../../../../core/services/user.service';
import { Project, ProjectStatus } from '../../../../core/models/project.model';
import { User } from '../../../../core/models/user.model';
import { DEPARTMENTS } from '../../../../core/models/department.model';

@Component({
  selector: 'app-team-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Team Management</h1>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Search Projects</mat-label>
            <input 
              matInput 
              [formControl]="searchControl"
              placeholder="Search by project name..."
            >
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Department</mat-label>
            <mat-select [formControl]="departmentControl">
              <mat-option value="">All Departments</mat-option>
              <mat-option *ngFor="let dept of departments" [value]="dept.id">
                {{ dept.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Status</mat-label>
            <mat-select [formControl]="statusControl">
              <mat-option value="">All Statuses</mat-option>
              <mat-option *ngFor="let status of projectStatuses" [value]="status">
                {{ status }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </div>

      <!-- Projects Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          *ngFor="let project of displayedProjects" 
          class="card hover:shadow-lg transition-shadow cursor-pointer" 
          [routerLink]="['/team', project.id]"
        >
          <div class="flex items-center mb-4">
            <div class="p-3 rounded-full bg-primary-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold">{{ project.name }}</h3>
              <p class="text-sm text-gray-600">{{ getDepartmentName(project.departmentId) }}</p>
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex items-center">
              <span class="text-sm font-medium text-gray-500">Status:</span>
              <span class="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                [ngClass]="{
                  'bg-green-100 text-green-800': project.status === 'ACTIVE',
                  'bg-yellow-100 text-yellow-800': project.status === 'ON_HOLD',
                  'bg-blue-100 text-blue-800': project.status === 'COMPLETED'
                }">
                {{ project.status }}
              </span>
            </div>
            
            <div class="flex items-center">
              <span class="text-sm font-medium text-gray-500">Team Lead:</span>
              <span class="ml-2 text-sm text-gray-900">{{ getTeamLeadName(project.teamLeadId) }}</span>
            </div>

            <div>
              <span class="text-sm font-medium text-gray-500">Team Size:</span>
              <span class="ml-2 text-sm text-gray-900">{{ project.teamMemberIds.length }} members</span>
            </div>
          </div>

          <div class="mt-4 text-sm text-primary-600">
            Click to view details →
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <mat-paginator
        class="mt-6"
        [length]="filteredProjects.length"
        [pageSize]="pageSize"
        [pageSizeOptions]="[6, 12, 24, 48]"
        (page)="onPageChange($event)"
        aria-label="Select page"
      >
      </mat-paginator>
    </div>
  `
})
export class TeamDashboardComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  displayedProjects: Project[] = [];
  users: User[] = [];
  departments = DEPARTMENTS;
  projectStatuses = Object.values(ProjectStatus);

  searchControl = new FormControl('');
  departmentControl = new FormControl('');
  statusControl = new FormControl('');

  // Pagination
  pageSize = 6;
  currentPage = 0;

  constructor(
    private projectService: ProjectService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadData();
    this.setupFilters();
  }

  private loadData() {
    this.projectService.getProjects().subscribe(projects => {
      this.projects = projects;
      this.applyFilters();
    });

    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  private setupFilters() {
    // Combine all filter changes
    this.searchControl.valueChanges.subscribe(() => this.applyFilters());
    this.departmentControl.valueChanges.subscribe(() => this.applyFilters());
    this.statusControl.valueChanges.subscribe(() => this.applyFilters());
  }

  private applyFilters() {
    let filtered = [...this.projects];
    
    // Apply search filter
    const searchTerm = this.searchControl.value?.toLowerCase();
    if (searchTerm) {
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply department filter
    const department = this.departmentControl.value;
    if (department) {
      filtered = filtered.filter(project => project.departmentId === department);
    }

    // Apply status filter
    const status = this.statusControl.value;
    if (status) {
      filtered = filtered.filter(project => project.status === status);
    }

    this.filteredProjects = filtered;
    this.updateDisplayedProjects();
  }

  private updateDisplayedProjects() {
    const startIndex = this.currentPage * this.pageSize;
    this.displayedProjects = this.filteredProjects.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedProjects();
  }

  getDepartmentName(departmentId: string): string {
    const department = this.departments.find(d => d.id === departmentId);
    return department?.name || 'Unknown';
  }

  getTeamLeadName(teamLeadId: string): string {
    const teamLead = this.users.find(u => u.id === teamLeadId);
    return teamLead ? `${teamLead.firstName} ${teamLead.lastName}` : 'Unassigned';
  }
}