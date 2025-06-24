import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../../../core/services/project.service';
import { UserService } from '../../../../core/services/user.service';
import { Project } from '../../../../core/models/project.model';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-team-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">{{ project?.name }}</h1>
        <button class="btn-outline" routerLink="/team">Back to Teams</button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Project Info -->
        <div class="card">
          <h2 class="text-xl font-semibold mb-4">Project Information</h2>
          <div class="space-y-4">
            <div>
              <p class="text-sm font-medium text-gray-500">Department</p>
              <p class="mt-1">{{ getDepartmentName(project?.departmentId) }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Status</p>
              <span class="mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                [ngClass]="{
                  'bg-green-100 text-green-800': project?.status === 'ACTIVE',
                  'bg-yellow-100 text-yellow-800': project?.status === 'ON_HOLD',
                  'bg-blue-100 text-blue-800': project?.status === 'COMPLETED'
                }">
                {{ project?.status }}
              </span>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Start Date</p>
              <p class="mt-1">{{ project?.startDate | date }}</p>
            </div>
            <div *ngIf="project?.endDate">
              <p class="text-sm font-medium text-gray-500">End Date</p>
              <p class="mt-1">{{ project?.endDate | date }}</p>
            </div>
          </div>
        </div>

        <!-- Team Lead -->
        <div class="card">
          <h2 class="text-xl font-semibold mb-4">Team Lead</h2>
          <div *ngIf="teamLead" class="flex items-center">
            <img 
              [src]="teamLead.profileImage || 'https://randomuser.me/api/portraits/lego/1.jpg'" 
              alt="Team Lead" 
              class="w-12 h-12 rounded-full"
            >
            <div class="ml-4">
              <p class="font-medium">{{ teamLead.firstName }} {{ teamLead.lastName }}</p>
              <p class="text-sm text-gray-500">{{ teamLead.position }}</p>
              <p class="text-sm text-gray-500">{{ teamLead.email }}</p>
            </div>
          </div>
        </div>

        <!-- Team Members -->
        <div class="card">
          <h2 class="text-xl font-semibold mb-4">Team Members</h2>
          <div class="space-y-4">
            <div *ngFor="let member of teamMembers" class="flex items-center">
              <img 
                [src]="member.profileImage || 'https://randomuser.me/api/portraits/lego/1.jpg'" 
                alt="Team Member" 
                class="w-10 h-10 rounded-full"
              >
              <div class="ml-3">
                <p class="font-medium">{{ member.firstName }} {{ member.lastName }}</p>
                <p class="text-sm text-gray-500">{{ member.position }}</p>
              </div>
              <div class="ml-auto">
                <button 
                  class="text-primary-600 hover:text-primary-900"
                  [routerLink]="['/evaluations/new']"
                  [queryParams]="{ userId: member.id }"
                >
                  Evaluate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TeamDetailsComponent implements OnInit {
  project?: Project;
  teamLead?: User;
  teamMembers: User[] = [];

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private userService: UserService
  ) {}

  ngOnInit() {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.loadProjectData(projectId);
    }
  }

  private loadProjectData(projectId: string) {
    this.projectService.getProjectById(projectId).subscribe(project => {
      if (project) {
        this.project = project;
        this.loadTeamMembers(project);
      }
    });
  }

  private loadTeamMembers(project: Project) {
    this.userService.getUsers().subscribe(users => {
      this.teamLead = users.find(u => u.id === project.teamLeadId);
      this.teamMembers = users.filter(u => project.teamMemberIds.includes(u.id));
    });
  }

  getDepartmentName(departmentId?: string): string {
    if (!departmentId) return 'Unknown';
    
    const departmentMap: {[key: string]: string} = {
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