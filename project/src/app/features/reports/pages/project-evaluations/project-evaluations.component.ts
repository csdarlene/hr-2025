import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../../../core/services/project.service';
import { EvaluationService } from '../../../../core/services/evaluation.service';
import { UserService } from '../../../../core/services/user.service';
import { Project } from '../../../../core/models/project.model';
import { User } from '../../../../core/models/user.model';
import { Evaluation, EvaluationType, EvaluationStatus } from '../../../../core/models/evaluation.model';

@Component({
  selector: 'app-project-evaluations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Project Evaluations: {{ project?.name }}</h1>
        <button class="btn-outline" routerLink="/reports">Back to Reports</button>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team Member
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Self Evaluation
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team Lead Evaluation
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let member of teamMembers">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img 
                      [src]="member.profileImage || 'https://randomuser.me/api/portraits/lego/1.jpg'" 
                      alt="Profile" 
                      class="h-8 w-8 rounded-full"
                    >
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ member.firstName }} {{ member.lastName }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ member.position }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    [ngClass]="getStatusClass(getSelfEvaluation(member)?.status)">
                    {{ getSelfEvaluation(member)?.status || 'Not Started' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    [ngClass]="getStatusClass(getTeamLeadEvaluation(member)?.status)">
                    {{ getTeamLeadEvaluation(member)?.status || 'Not Started' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    [ngClass]="getCombinedStatusClass(member)">
                    {{ getCombinedStatus(member) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    *ngIf="canCompare(member)"
                    class="text-primary-600 hover:text-primary-900"
                    [routerLink]="['/reports/evaluations/compare', member.id, projectId]"
                  >
                    Compare & Finalize
                  </button>
                  <span *ngIf="!canCompare(member)" class="text-gray-400">
                    Waiting for Evaluations
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ProjectEvaluationsComponent implements OnInit {
  projectId: string = '';
  project?: Project;
  teamMembers: User[] = [];
  evaluations: Evaluation[] = [];

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private evaluationService: EvaluationService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id') || '';
    this.loadData();
  }

  private loadData() {
    this.projectService.getProjectById(this.projectId).subscribe(project => {
      this.project = project;
      if (project) {
        this.userService.getUsersByProject(project.id).subscribe(users => {
          this.teamMembers = users;
        });
      }
    });

    this.evaluationService.getEvaluationsForProject(this.projectId).subscribe(evaluations => {
      this.evaluations = evaluations;
    });
  }

  getSelfEvaluation(member: User): Evaluation | undefined {
    return this.evaluations.find(e => 
      e.userId === member.id && 
      e.type === EvaluationType.SELF
    );
  }

  getTeamLeadEvaluation(member: User): Evaluation | undefined {
    return this.evaluations.find(e => 
      e.userId === member.id && 
      e.type === EvaluationType.TEAM_LEAD
    );
  }

  getStatusClass(status?: EvaluationStatus): string {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status) {
      case EvaluationStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case EvaluationStatus.SUBMITTED:
        return 'bg-blue-100 text-blue-800';
      case EvaluationStatus.IN_REVIEW:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getCombinedStatusClass(member: User): string {
    const selfEval = this.getSelfEvaluation(member);
    const teamLeadEval = this.getTeamLeadEvaluation(member);

    if (!selfEval || !teamLeadEval) return 'bg-gray-100 text-gray-800';
    if (selfEval.status === EvaluationStatus.COMPLETED && 
        teamLeadEval.status === EvaluationStatus.COMPLETED) {
      return 'bg-green-100 text-green-800';
    }
    return 'bg-yellow-100 text-yellow-800';
  }

  getCombinedStatus(member: User): string {
    const selfEval = this.getSelfEvaluation(member);
    const teamLeadEval = this.getTeamLeadEvaluation(member);

    if (!selfEval && !teamLeadEval) return 'Not Started';
    if (!selfEval || !teamLeadEval) return 'Partially Complete';
    if (selfEval.status === EvaluationStatus.COMPLETED && 
        teamLeadEval.status === EvaluationStatus.COMPLETED) {
      return 'Ready for Review';
    }
    return 'In Progress';
  }

  canCompare(member: User): boolean {
    const selfEval = this.getSelfEvaluation(member);
    const teamLeadEval = this.getTeamLeadEvaluation(member);

    return !!(selfEval?.status === EvaluationStatus.COMPLETED && 
             teamLeadEval?.status === EvaluationStatus.COMPLETED);
  }
}