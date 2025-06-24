import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProjectService } from '../../../../core/services/project.service';
import { UserService } from '../../../../core/services/user.service';
import { Project } from '../../../../core/models/project.model';
import { ProjectDialogComponent } from '../../dialogs/project-dialog/project-dialog.component';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-project-config',
  standalone: true,
  imports: [CommonModule, RouterModule, MatDialogModule, DataTableComponent],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Projecten Configuratie</h1>
        <button class="btn-primary" (click)="openDialog()">
          Nieuw Project
        </button>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6">
        <app-data-table 
          [data]="projects"
          [columns]="columns"
          [showActions]="true"
        >
          <ng-template actions let-project>
            <button class="text-primary-600 hover:text-primary-900 mr-3" (click)="onEdit(project)">
              Bewerken
            </button>
            <button class="text-red-600 hover:text-red-900" (click)="onDelete(project)">
              Verwijderen
            </button>
          </ng-template>
        </app-data-table>
      </div>
    </div>
  `
})
export class ProjectConfigComponent implements OnInit {
  projects: Project[] = [];
  teamLeads: {[key: string]: string} = {};
  
  columns = [
    { key: 'name', label: 'Project Naam', type: 'text' },
    { key: 'teamLeadId', label: 'Team Lead', type: 'teamLead' },
    { key: 'departmentId', label: 'Afdeling', type: 'department' },
    { key: 'startDate', label: 'Start Datum', type: 'date' },
    { key: 'status', label: 'Status', type: 'status' }
  ];

  constructor(
    private projectService: ProjectService,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadProjects();
    this.loadTeamLeads();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe(projects => {
      this.projects = projects;
    });
  }

  loadTeamLeads() {
    this.userService.getUsers().subscribe(users => {
      users.forEach(user => {
        this.teamLeads[user.id] = `${user.firstName} ${user.lastName}`;
      });
    });
  }

  openDialog(project?: Project) {
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      width: '500px',
      data: project || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProjects();
      }
    });
  }

  onEdit(project: Project) {
    this.openDialog(project);
  }

  onDelete(project: Project) {
    if (confirm(`Weet u zeker dat u het project "${project.name}" wilt verwijderen?`)) {
      this.projectService.deleteProject(project.id).subscribe(() => {
        this.loadProjects();
      });
    }
  }
}