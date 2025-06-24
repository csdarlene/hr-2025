import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { CriteriaConfigComponent } from './pages/criteria-config/criteria-config.component';
import { EmployeeConfigComponent } from './pages/employee-config/employee-config.component';
import { ProjectConfigComponent } from './pages/project-config/project-config.component';
import { DepartmentConfigComponent } from './pages/department-config/department-config.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminDashboardComponent
  },
  {
    path: 'criteria',
    component: CriteriaConfigComponent
  },
  {
    path: 'employees',
    component: EmployeeConfigComponent
  },
  {
    path: 'projects',
    component: ProjectConfigComponent
  },
  {
    path: 'departments',
    component: DepartmentConfigComponent
  },
  {
    path: 'users',
    component: UserManagementComponent
  }
];