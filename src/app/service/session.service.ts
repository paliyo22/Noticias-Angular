import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, of, map } from 'rxjs';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private _status = new BehaviorSubject<'unknown' | 'loggedIn' | 'refreshable' | 'guest'>('unknown');
  private userService = inject(UserService);
  private authService = inject(AuthService);

  constructor() {
    this.detectSession();
  }

  get status$(): Observable<string> {
    return this._status.asObservable();
  }

  private detectSession() {
    this.userService.getInfo().pipe(
      tap(() => this._status.next('loggedIn')),
      catchError(() => {
        // Si getInfo falla, intentamos refresh
        return this.authService.refresh().pipe(
          tap(() => this._status.next('loggedIn')),
          catchError(() => {
            this._status.next('guest');
            return of(null);
          })
        );
      })
    ).subscribe();
  }

  isLoggedIn(): Observable<boolean> {
    return this.status$.pipe(map(status => status === 'loggedIn'));
  }
}