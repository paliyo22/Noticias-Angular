import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { UserService } from '../service/user.service';

export const adminguardGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.getInfo().pipe(
    map(user => {
      if (user.role === 'admin') {
        return true;
      } else {
        router.navigate(['/']);
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/']);
      return of(false);
    })
  );
};