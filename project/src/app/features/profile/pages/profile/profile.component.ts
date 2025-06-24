import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../../../core/services/auth.service';
import { ChangePasswordDialogComponent } from '../../dialogs/change-password-dialog/change-password-dialog.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-lg">
          <!-- Profile Info -->
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center">
              <img 
                [src]="authService.currentUser?.profileImage || 'https://randomuser.me/api/portraits/lego/1.jpg'" 
                alt="Profile picture"
                class="w-24 h-24 rounded-full"
              >
              <div class="ml-6">
                <h1 class="text-2xl font-bold">
                  {{ authService.currentUser?.firstName }} {{ authService.currentUser?.lastName }}
                </h1>
                <p class="text-gray-600">{{ authService.currentUser?.position }}</p>
              </div>
            </div>
          </div>

          <!-- User Details -->
          <div class="p-6 border-b border-gray-200">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold">Personal Information</h2>
              <button 
                class="btn-primary"
                (click)="openChangePasswordDialog()"
              >
                Change Password
              </button>
            </div>
            <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt class="text-sm font-medium text-gray-500">Email</dt>
                <dd class="mt-1 text-lg">{{ authService.currentUser?.email }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Phone</dt>
                <dd class="mt-1 text-lg">{{ authService.currentUser?.phoneNumber }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Department</dt>
                <dd class="mt-1 text-lg">{{ getDepartmentName(authService.currentUser?.departmentId) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Level</dt>
                <dd class="mt-1 text-lg">{{ authService.currentUser?.level }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Start Date</dt>
                <dd class="mt-1 text-lg">{{ authService.currentUser?.startDate | date }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Role</dt>
                <dd class="mt-1 text-lg">{{ getRoleDisplay(authService.currentUser?.role) }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent {
  constructor(
    public authService: AuthService,
    private dialog: MatDialog
  ) {}

  getDepartmentName(departmentId: string | undefined): string {
    if (!departmentId) return '';
    
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

  getRoleDisplay(role: string | undefined): string {
    if (!role) return '';

    const roleMap: {[key: string]: string} = {
      'ADMIN': 'Administrator',
      'HR': 'HR Manager',
      'MANAGEMENT': 'Management',
      'TEAM_LEAD': 'Team Lead',
      'TEAM_MEMBER': 'Team Member'
    };

    return roleMap[role] || role;
  }

  openChangePasswordDialog() {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Password was successfully changed
        console.log('Password updated successfully');
      }
    });
  }
}