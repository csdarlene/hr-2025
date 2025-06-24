import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-8">System Configuration</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Employees Configuration -->
        <div class="card hover:scale-105 transition-transform cursor-pointer" routerLink="employees">
          <div class="flex items-center mb-4">
            <div class="p-3 rounded-full bg-primary-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold ml-4">Werknemers</h2>
          </div>
          <p class="text-gray-600">Beheer werknemersprofielen en hun rollen</p>
        </div>

        <!-- Forms Criteria Configuration -->
        <div class="card hover:scale-105 transition-transform cursor-pointer" routerLink="criteria">
          <div class="flex items-center mb-4">
            <div class="p-3 rounded-full bg-secondary-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold ml-4">Configuraties</h2>
          </div>
          <p class="text-gray-600">Beheer evaluatiecriteria en formulieren</p>
        </div>

        <!-- Projects Configuration -->
        <div class="card hover:scale-105 transition-transform cursor-pointer" routerLink="projects">
          <div class="flex items-center mb-4">
            <div class="p-3 rounded-full bg-accent-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold ml-4">Projecten</h2>
          </div>
          <p class="text-gray-600">Beheer projecten en teamtoewijzingen</p>
        </div>

        <!-- Departments Configuration -->
        <div class="card hover:scale-105 transition-transform cursor-pointer" routerLink="departments">
          <div class="flex items-center mb-4">
            <div class="p-3 rounded-full bg-primary-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold ml-4">Afdelingen</h2>
          </div>
          <p class="text-gray-600">Beheer afdelingen en hun structuur</p>
        </div>

        <!-- Reports -->
        <div class="card hover:scale-105 transition-transform cursor-pointer" routerLink="/reports">
          <div class="flex items-center mb-4">
            <div class="p-3 rounded-full bg-secondary-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold ml-4">Rapporten</h2>
          </div>
          <p class="text-gray-600">Bekijk en genereer rapporten</p>
        </div>

        <!-- Teams -->
        <div class="card hover:scale-105 transition-transform cursor-pointer" routerLink="/team">
          <div class="flex items-center mb-4">
            <div class="p-3 rounded-full bg-accent-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold ml-4">Teams</h2>
          </div>
          <p class="text-gray-600">Beheer teams en hun leden</p>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent {}