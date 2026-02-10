import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { AuthInput, Session, UserInput } from '../schema/user';
import { withAuthRetry } from '../helper/http-helper';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl = 'https://server-news-project.onrender.com';
  private http = inject(HttpClient);

  authState = signal({
    logged: false,
    username: null as string | null,
    loading: false,
    error: null as string | null
  });

  setState(): void {
    this.authState.update(() => ({
      logged: false,
      username: null,
      loading: false,
      error: null
    }));
  }
  
  register(body: UserInput): void {
    
    this.authState.update(state =>({
      ...state,
      loading: true,
      error: null
    }));

    this.http.post<Session>(
      `${this.apiUrl}/auth/register`,
      body, { withCredentials: true }
    ).pipe(
      tap({
        next: (response) => {
          this.authState.update(() => ({
            logged: true,
            username: response.username,
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
        return of(null); 
      })
    ).subscribe();
  }

  logIn(auth: AuthInput): void {
    
    this.authState.update(state =>({
      ...state,
      loading: true,
      error: null
    }));

    this.http.post<Session>(
      `${this.apiUrl}/auth/login`,
      auth, { withCredentials: true }
    ).pipe(
      tap({
        next: (response) => {
          this.authState.update(() => ({
            logged: true,
            username: response.username,
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
        return of(null); 
      })
    ).subscribe();
  }

  logOut(): void {

    this.authState.update(state =>({
      ...state,
      loading: true,
      error: null
    }));
    
    this.http.post<void>(
      `${this.apiUrl}/auth/logout`,
      {}, { withCredentials: true }
    ).pipe(
      tap({
        next: () => {
          this.authState.update(() => ({
            logged: false,
            username: null,
            loading: false,
            error: null
          }));
        }
      }),
      catchError((error) => {
        this.authState.update(state =>({
          ...state,
          loading: false,
          error: error.error?.error || 'Error en logout' 
        }));
        return of(null); 
      })
    ).subscribe();
  }

  refresh(): void {

    this.authState.update(state =>({
      ...state,
      loading: true,
      error: null
    }));

    this.http.post<Session>(
      `${this.apiUrl}/auth/refresh`,
      {}, { withCredentials: true }
    ).pipe(
      tap({
        next: (response) => {
          this.authState.update(() => ({
            logged: true,
            username: response.username,
            loading: false,
            error: null
          }));
        }
      }),
      catchError((error) => {
        this.authState.update(() =>({
          logged: false,
          username: null,
          loading: false,
          error: error.error?.error || 'Error al refrescar token' 
        }));
        console.log(error.error.error);
        return of(null); 
      })
    ).subscribe();
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
