import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-team-evaluations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Team Evaluaties</h1>
        <button class="btn-outline" routerLink="/evaluations">
          Terug naar Overzicht
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let member of teamMembers" class="card">
          <div class="flex items-center mb-4">
            <img 
              [src]="member.profileImage || 'https://randomuser.me/api/portraits/lego/1.jpg'" 
              alt="Profile picture"
              class="w-12 h-12 rounded-full"
            >
            <div class="ml-4">
              <h3 class="text-lg font-semibold">{{ member.firstName }} {{ member.lastName }}</h3>
              <p class="text-sm text-gray-600">{{ member.position }}</p>
            </div>
          </div>

          <div class="space-y-2">
            <p class="text-sm text-gray-600">Niveau: {{ member.level }}</p>
            <p class="text-sm text-gray-600">Afdeling: {{ getDepartmentName(member.departmentId) }}</p>
          </div>

          <div class="mt-4 flex justify-end">
            <button 
              class="btn-primary"
              [routerLink]="['/evaluations/new']"
              [queryParams]="{ userId: member.id }"
            >
              Evalueren
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TeamEvaluationsComponent implements OnInit {
  teamMembers: User[] = [];

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (this.authService.currentUser) {
      this.userService.getTeamMembers(this.authService.currentUser.id)
        .subscribe(members => {
          this.teamMembers = members;
        });
    }
  }

  getDepartmentName(departmentId: string): string {
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