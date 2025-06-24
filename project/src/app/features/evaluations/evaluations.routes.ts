import { Routes } from '@angular/router';
import { EvaluationsListComponent } from './pages/evaluations-list/evaluations-list.component';
import { EvaluationFormComponent } from './pages/evaluation-form/evaluation-form.component';
import { EvaluationDetailsComponent } from './pages/evaluation-details/evaluation-details.component';
import { TeamEvaluationsComponent } from './pages/team-evaluations/team-evaluations.component';
import { teamMemberGuard } from '../../core/guards/team-member.guard';
import { teamLeadGuard } from '../../core/guards/team-lead.guard';

export const EVALUATIONS_ROUTES: Routes = [
  {
    path: '',
    component: EvaluationsListComponent,
    canActivate: [teamMemberGuard]
  },
  {
    path: 'new',
    component: EvaluationFormComponent,
    canActivate: [teamMemberGuard]
  },
  {
    path: 'team',
    component: TeamEvaluationsComponent,
    canActivate: [teamLeadGuard]
  },
  {
    path: ':id',
    component: EvaluationDetailsComponent,
    canActivate: [teamMemberGuard]
  }
];