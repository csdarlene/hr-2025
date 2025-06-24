import { Routes } from '@angular/router';
import { ReportsComponent } from './pages/reports/reports.component';
import { ProjectEvaluationsComponent } from './pages/project-evaluations/project-evaluations.component';
import { EvaluationComparisonComponent } from './pages/evaluation-comparison/evaluation-comparison.component';
import { DepartmentAnalyticsComponent } from './pages/department-analytics/department-analytics.component';
import { EvaluationTrendsComponent } from './pages/evaluation-trends/evaluation-trends.component';
import { hrGuard } from '../../core/guards/hr.guard';
import { managementGuard } from '../../core/guards/management.guard';
import { teamLeadGuard } from '../../core/guards/team-lead.guard';

export const REPORTS_ROUTES: Routes = [
  {
    path: '',
    component: ReportsComponent,
    canActivate: [hrGuard]
  },
  {
    path: 'projects/:id/evaluations',
    component: ProjectEvaluationsComponent,
    canActivate: [hrGuard]
  },
  {
    path: 'evaluations/compare/:userId/:projectId',
    component: EvaluationComparisonComponent,
    canActivate: [hrGuard]
  },
  {
    path: 'departments',
    component: DepartmentAnalyticsComponent,
    canActivate: [hrGuard]
  },
  {
    path: 'trends',
    component: EvaluationTrendsComponent,
    canActivate: [hrGuard]
  }
];