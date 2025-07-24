import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { Role } from '../enum/role';

export const adminGuard = (requiredRole: Role): CanActivateFn => {
  return () => {
    const authService = inject(AuthService)
    const router = inject(Router)

    const userRole = authService.authState().role
    
    if (userRole !== requiredRole) {
      router.navigate(["/"])
      return false
    }

    return true
  }
};
