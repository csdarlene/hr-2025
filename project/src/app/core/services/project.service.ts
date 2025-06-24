import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Project, ProjectStatus } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects: Project[] = [
    {
      id: '1',
      name: 'HR System Redesign',
      description: 'Redesign and implement the company HR management system',
      teamLeadId: '3',
      teamMemberIds: ['4', '5'],
      startDate: new Date('2023-01-10'),
      departmentId: '1',
      status: ProjectStatus.ACTIVE
    },
    {
      id: '2',
      name: 'Customer Portal',
      description: 'Develop a customer portal for account management and support',
      teamLeadId: '3',
      teamMemberIds: ['6', '7'],
      startDate: new Date('2023-04-15'),
      departmentId: '2',
      status: ProjectStatus.ACTIVE
    },
    {
      id: '3',
      name: 'Mobile App Development',
      description: 'Create a mobile app for field service management',
      teamLeadId: '8',
      teamMemberIds: ['9', '10'],
      startDate: new Date('2023-06-01'),
      departmentId: '3',
      status: ProjectStatus.ON_HOLD
    }
  ];

  constructor() { }

  getProjects(): Observable<Project[]> {
    return of(this.projects).pipe(delay(300));
  }

  getProjectById(id: string): Observable<Project | undefined> {
    const project = this.projects.find(p => p.id === id);
    return of(project).pipe(delay(300));
  }

  getProjectsByDepartment(departmentId: string): Observable<Project[]> {
    const filteredProjects = this.projects.filter(p => p.departmentId === departmentId);
    return of(filteredProjects).pipe(delay(300));
  }

  getProjectsForTeamLead(teamLeadId: string): Observable<Project[]> {
    const filteredProjects = this.projects.filter(p => p.teamLeadId === teamLeadId);
    return of(filteredProjects).pipe(delay(300));
  }

  getProjectsForTeamMember(userId: string): Observable<Project[]> {
    const filteredProjects = this.projects.filter(p => p.teamMemberIds.includes(userId));
    return of(filteredProjects).pipe(delay(300));
  }

  createProject(project: Omit<Project, 'id'>): Observable<Project> {
    const newProject: Project = {
      ...project,
      id: (this.projects.length + 1).toString()
    };
    
    this.projects.push(newProject);
    return of(newProject).pipe(delay(500));
  }

  updateProject(id: string, updates: Partial<Project>): Observable<Project | undefined> {
    const projectIndex = this.projects.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      return of(undefined);
    }
    
    const updatedProject = {
      ...this.projects[projectIndex],
      ...updates
    };
    
    this.projects[projectIndex] = updatedProject;
    return of(updatedProject).pipe(delay(500));
  }

  deleteProject(id: string): Observable<boolean> {
    const initialLength = this.projects.length;
    this.projects = this.projects.filter(p => p.id !== id);
    const deleted = this.projects.length < initialLength;
    return of(deleted).pipe(delay(500));
  }
}