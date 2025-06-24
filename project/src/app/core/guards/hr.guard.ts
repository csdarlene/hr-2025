import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const hrGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isHR() || authService.isAdmin() || authService.isManagement()) {
    return true;
  }
  
  router.navigate(['/dashboard']);
  return false;
};