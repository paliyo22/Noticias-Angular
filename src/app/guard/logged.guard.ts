import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const loggedGuard = (requireAuth = true): CanActivateFn => {
  return () => {
    const authService = inject(AuthService)
    const router = inject(Router)

    const isLogged = authService.authState().logged

    if (requireAuth) {

      if (!isLogged) {
        router.navigate(["/"])
        return false
      }
    } else {

      if (isLogged) {
        router.navigate(["/user"]) 
        return false
      }
    }

    return true
  }
};
