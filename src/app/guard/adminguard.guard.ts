import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { UserService } from '../service/user.service';
import { AuthService } from '../service/auth.service';

export const adminguardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.authState().logged){
    router.navigate(['/']);
    return false;
  }else return true;
};