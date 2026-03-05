import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { AuthInput, Session, UserInput } from '../schema/user';
import { Role } from '../enum/role';
import { withAuthRetry } from '../helper/http-helper';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl = 'https://server-news-project.onrender.com';
  private http = inject(HttpClient);

  authState = signal({
    logged: false,
    username: null as string | null,
    role: null as Role | null,
    loading: false,
    error: null as string | null
  });

  setState(): void {
    this.authState.update(() => ({
      logged: false,
      username: null,
      role: null,
      loading: false,
      error: null
    }));
  }
  
  register(body: UserInput): Observable<Session> {
  
    this.authState.update(state =>({
      ...state,
      loading: true,
      error: null
    }));

    return this.http.post<Session>(
      `${this.apiUrl}/auth/register`,
      body, { withCredentials: true }
    ).pipe(
      tap({
        next: (response) => {
          this.authState.update(() => ({
            logged: true,
            username: response.username,
            role: response.role,
            loading: false,
            error: null
          }));
        }
      }),
      catchError((error) => {
        this.authState.update(state =>({
          ...state,
          loading: false,
          error: error.error?.error || 'Error al registrarse' 
        }));
        return throwError(() => error); 
      })
    );
  }

  logIn(auth: AuthInput): Observable<Session> {
    
    this.authState.update(state =>({
      ...state,
      loading: true,
      error: null
    }));

    return this.http.post<Session>(
      `${this.apiUrl}/auth/login`,
      auth, { withCredentials: true }
    ).pipe(
      tap({
        next: (response) => {
          this.authState.update(() => ({
            logged: true,
            username: response.username,
            role: response.role,
            loading: false,
            error: null
          }));
        }
      }),
      catchError((error) => {
        this.authState.update(state =>({
          ...state,
          loading: false,
          error: error.error?.error || 'Error al ingresar' 
        }));
        return throwError(() => error);
      })
    );
  }

  logOut(): Observable<void> {

    this.authState.update(state =>({
      ...state,
      loading: true,
      error: null
    }));
    
    return this.http.post<void>(
      `${this.apiUrl}/auth/logout`,
      {}, { withCredentials: true }
    ).pipe(
      tap({
        next: () => {
          this.setState();
        }
      }),
      catchError((error) => {
        this.setState();
        this.authState.update(state =>({
          ...state,
          error: error.error?.error || 'Error en logout' 
        }));
        return throwError(() => error); 
      })
    );
  }

  newPassword(oldPass: string, newPass: string): void {
  
    this.authState.update(state =>({
      ...state,
      loading: true,
      error: null
    }));

    withAuthRetry<void>(() =>
      this.http.post<void>(
      `${this.apiUrl}/auth/password`,
      {oldPass, newPass}, { withCredentials: true }),
      this
    ).pipe(
      tap({
        next: () => {
          this.authState.update(state => ({
            ...state,
            loading: false,
            error: null
          }));
        }
      }),
      catchError((error) => {
        this.authState.update(state =>({
          ...state,
          loading: false,
          error: error.error?.error || 'Error al cambiar contraseña' 
        }));
        return of(null); 
      })
    ).subscribe();
  }

  newRole(id: string, role: Role): void {

    this.authState.update(state =>({
      ...state,
      loading: true,
      error: null
    }));

    withAuthRetry<void>(() =>
      this.http.post<void>(
      `${this.apiUrl}/auth/role`,
      {id, role}, { withCredentials: true }),
      this
    ).pipe(
      tap({
        next: () => {
          this.authState.update(state => ({
            ...state,
            loading: false,
            error: null
          }));
        }
      }),
      catchError((error) => {
        this.authState.update(state =>({
          ...state,
          loading: false,
          error: error.error?.error || `Error al cambiar el rol del usuario ${id}`  
        }));
        return of(null); 
      })
    ).subscribe();
  }

  refresh$(): Observable<boolean> {
    this.authState.update(state => ({
      ...state,
      loading: true,
      error: null
    }));

    return this.http.post<Session>(
      `${this.apiUrl}/auth/refresh`,
      {}, { withCredentials: true }
    ).pipe(
      tap(response => {
        this.authState.update(() => ({
          logged: true,
          username: response.username,
          role: response.role,
          loading: false,
          error: null
        }));
      }),
      switchMap(() => of(true)),
      catchError(error => {
        if(error.status !== 500){
          this.setState();
        }
        this.authState.update((state) => ({
          ...state,
          error: error.error?.error || 'Error al refrescar token'
        }));
        return of(false);
      })
    );
  }
}
