import { Routes } from '@angular/router';
import { TeamDashboardComponent } from './pages/team-dashboard/team-dashboard.component';
import { TeamDetailsComponent } from './pages/team-details/team-details.component';
import { teamLeadGuard } from '../../core/guards/team-lead.guard';
import { managementGuard } from '../../core/guards/management.guard';

export const TEAM_ROUTES: Routes = [
  {
    path: '',
    component: TeamDashboardComponent,
    canActivate: [teamLeadGuard, managementGuard]
  },
  {
    path: ':id',
    component: TeamDetailsComponent,
    canActivate: [teamLeadGuard, managementGuard]
  }
];