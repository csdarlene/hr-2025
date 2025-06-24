import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { EvaluationService } from '../../../../core/services/evaluation.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-evaluations-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-8">Mijn Evaluaties</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- View All Evaluations -->
        <div class="card hover:shadow-xl transition-shadow cursor-pointer" routerLink="list">
          <div class="flex items-center mb-4">
            <div class="p-3 rounded-full bg-primary-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold ml-4">Alle Evaluaties</h2>
          </div>
          <p class="text-gray-600">Bekijk alle evaluaties gefilterd op afdeling en niveau.</p>
        </div>

        <!-- New Evaluation -->
        <div class="card hover:shadow-xl transition-shadow cursor-pointer" routerLink="new">
          <div class="flex items-center mb-4">
            <div class="p-3 rounded-full bg-secondary-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold ml-4">Nieuwe Evaluatie</h2>
          </div>
          <p class="text-gray-600">Start een nieuwe evaluatie gebaseerd op jouw afdeling en niveau.</p>
        </div>

        <!-- My Evaluations -->
        <div class="card hover:shadow-xl transition-shadow cursor-pointer" routerLink="my">
          <div class="flex items-center mb-4">
            <div class="p-3 rounded-full bg-accent-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold ml-4">Mijn Evaluaties</h2>
          </div>
          <p class="text-gray-600">Bekijk jouw eerder ingediende evaluaties.</p>
        </div>

        <!-- Team Evaluations (Only visible for team leads) -->
        <div *ngIf="authService.isTeamLead()" class="card hover:shadow-xl transition-shadow cursor-pointer" routerLink="team">
          <div class="flex items-center mb-4">
            <div class="p-3 rounded-full bg-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold ml-4">Team Evaluaties</h2>
          </div>
          <p class="text-gray-600">Evalueer de leden van jouw team.</p>
        </div>
      </div>
    </div>
  `
})
export class EvaluationsListComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private evaluationService: EvaluationService
  ) {}

  ngOnInit() {}
}