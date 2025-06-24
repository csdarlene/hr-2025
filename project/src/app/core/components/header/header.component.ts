import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <a routerLink="/" class="flex-shrink-0 flex items-center">
              <span class="text-2xl font-bold text-primary-600">HR Performance</span>
            </a>
          </div>
          
          <div class="flex items-center" *ngIf="authService.isLoggedIn">
            <div class="ml-3 relative">
              <div>
                <button 
                  type="button" 
                  class="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  (click)="toggleDropdown()"
                >
                  <span class="sr-only">Open user menu</span>
                  <img 
                    class="h-8 w-8 rounded-full" 
                    [src]="authService.currentUser?.profileImage || 'https://randomuser.me/api/portraits/lego/1.jpg'" 
                    alt="User avatar"
                  >
                  <span class="ml-2 text-gray-700">{{ authService.currentUser?.firstName }} {{ authService.currentUser?.lastName }}</span>
                  <svg class="ml-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div 
                *ngIf="isDropdownOpen" 
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
              >
                <a 
                  routerLink="/profile" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                  role="menuitem"
                  (click)="closeDropdown()"
                >
                  Your Profile
                </a>
                <a 
                  href="#" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                  role="menuitem"
                  (click)="logout()"
                >
                  Sign out
                </a>
              </div>
            </div>
          </div>
          
          <div class="flex items-center" *ngIf="!authService.isLoggedIn">
            <a 
              routerLink="/auth/login" 
              class="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Sign in
            </a>
          </div>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  isDropdownOpen = false;

  constructor(public authService: AuthService) {}

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.closeDropdown();
    window.location.href = '/auth/login';
  }
}