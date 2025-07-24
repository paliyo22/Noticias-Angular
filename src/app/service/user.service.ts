import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { UserInput, UserOutput } from '../schema/user';
import { withAuthRetry } from '../helper/http-helper';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private apiUrl = 'https://server-news-project.onrender.com';
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  userState = signal({
    user: {
      data: null as UserOutput | null,
      loading: false,
      error: null as string | null
    },
    allUsers: {
      data: [] as UserOutput[],
      loading: false,
      error: null as string | null
    },
    result: {
      state: false,
      loading: false,
      error: null as string | null
    }
  })
  
  getInfo(): void { 

    this.userState.update(state => ({
      ...state,
      user: {
        data: null,
        loading: true,
        error: null
      }
    }));

    withAuthRetry<{ user: UserOutput }>(() =>
      this.http.get<{ user: UserOutput }>(`${this.apiUrl}/user/me`,
      { withCredentials: true }),
      this.authService
    ).pipe(
      tap({
        next: (response) => {
          this.userState.update(state => ({
            ...state,
            user: {
              data: response.user,
              loading: false,
              error: null
            }
          }))
        }
      }),
      catchError((error) => {
        this.userState.update(state => ({
          ...state,
          user: {
            ...state.user,
            loading: false,
            error: error.error?.error || 'Error al buscar los datos'
          }
        }));
        return of(null); 
      })
    ).subscribe();
  }

  getAll(): void {
    
    this.userState.update(state => ({
      ...state,
      allUsers: {
        data: [],
        loading: true,
        error: null
      }
    }));

    withAuthRetry<{ user: UserOutput[] }>(() =>
      this.http.get<{ user: UserOutput[] }>(`${this.apiUrl}/user/all`, { withCredentials: true }),
      this.authService
    ).pipe(
      tap({
        next: (response) => {
          this.userState.update(state => ({
            ...state,
            allUsers: {
              data: response.user,
              loading: false,
              error: null,
            }
          }));
        }
      }),
      catchError((error) => {
        this.userState.update(state => ({
          ...state,
          allUsers: {
            ...state.allUsers,
            loading: false,
            error: error.error?.error || 'Error al buscar los usuarios'
          }
        }));
        return of(null); 
      })
    ).subscribe();
  }

  getUser(id: string): void {

    this.userState.update(state => ({
      ...state,
      user: {
        data: null,
        loading: true,
        error: null
      }
    }));

    withAuthRetry<{ user: UserOutput }>(() =>
      this.http.get<{ user: UserOutput }>(`${this.apiUrl}/user/${id}`, 
      { withCredentials: true }),
      this.authService
    ).pipe(
      tap({
        next: (result) => {
          this.userState.update(state => ({
            ...state,
            user: {
              data: result.user,
              loading: false,
              error: null
            }
          }));
        }
      }),
      catchError((error) => {
        this.userState.update(state => ({
          ...state,
          user: {
            ...state.user,
            loading: false,
            error: error.error?.error || 'Error al buscar el usuario'
          }
        }));
        return of(null); 
      })
    ).subscribe();
  }

  update(user: Partial<UserInput>): void {

    this.userState.update(state => ({
      ...state,
      user: {
        ...state.user,
        loading: true,
        error: null
      }
    }));
    console.log(user);

    withAuthRetry<{ user: UserOutput }>(() =>
      this.http.patch<{ user: UserOutput }>(`${this.apiUrl}/user/me`,
      user, {withCredentials: true}),
      this.authService
    ).pipe(
      tap({
        next: (result) => {
          this.userState.update(state => ({
            ...state,
            user: {
              data: result.user,
              loading: false,
              error: null
            }
          }));
        }
      }),
      catchError((error) => {
        this.userState.update(state => ({
          ...state,
          user: {
            data: null,
            loading: false,
            error: error.error?.error || 'Error al actualizar los datos'
          }
        }));
        return of(null); 
      })
    ).subscribe();
  }

  delete(id?: string): void {
    
    this.userState.update(state => ({
      ...state,
      result: {
        state: false,
        loading: true,
        error: null
      }
    }));
    
    withAuthRetry<void>(() =>
      this.http.post<void>(`${this.apiUrl}/user/delete`, {id}, {withCredentials: true}),
      this.authService
    ).pipe(
      tap({
        next: () => {
          this.userState.update(state => ({
            ...state,
            result: {
              state: true,
              loading: false,
              error: null
            }
          }));
          this.getAll();
        }
      }),
      catchError((error) => {
        this.userState.update(state => ({
          ...state,
          result: {
            state: false,
            loading: false,
            error: error.error?.error || 'Error al borrar'
          }
        }));
        return of(null); 
      })
    ).subscribe();
  }
  // ------ se pueden implementar effects en los componentes para que los ressult tengan impacto en el programa---
  clean(password: string): void { 

    this.userState.update(state => ({
      ...state,
      result: {
        state: false,
        loading: true,
        error: null
      }
    }));

    withAuthRetry<{success: boolean, deleted: number}>(() =>
      this.http.delete<{success: boolean, deleted: number}>(`${this.apiUrl}/user/clean`,
      {body: {password}, withCredentials: true}),
      this.authService
    ).pipe(
      tap({
        next: () => {
          this.userState.update(state => ({
            ...state,
            result: {
              state: true,
              loading: false,
              error: null
            }
          }));
          this.getAll();
        }
      }),
      catchError((error) => {
        this.userState.update(state => ({
          ...state,
          result: {
            state: false,
            loading: false,
            error: error.error?.error || 'Error al limpiar'
          }
        }));
        return of(null); 
      })
    ).subscribe();
  }

  addLike(id: string): void{

    this.userState.update(state => ({
      ...state,
      result: {
        state: false,
        loading: true,
        error: null
      }
    }));

    withAuthRetry<void>(() =>
      this.http.post<void>(`${this.apiUrl}/user/like/${id}`,
      {}, {withCredentials: true}),
      this.authService
    ).pipe(
      tap({
        next: () => {
          this.userState.update(state => ({
            ...state,
            result: {
              state: true,
              loading: false,
              error: null
            }
          }));
        }
      }),
      catchError((error) => {
          this.userState.update(state => ({
            ...state,
            result: {
              state: false,
              loading: false,
              error: error.error?.error || 'Error al guardar like'
            }
          }));
        return of(null); 
      })
    ).subscribe();
  }

  deleteLike(id: string): void {
    
    this.userState.update(state => ({
      ...state,
      result: {
        state: true,
        loading: true,
        error: null
      }
    }));

    withAuthRetry<void>(() =>
      this.http.delete<void>(`${this.apiUrl}/user/like/${id}`,
      {withCredentials: true}),
      this.authService
    ).pipe(
      tap({
        next: () => {
          this.userState.update(state => ({
            ...state,
            result: {
              state: false,
              loading: false,
              error: null
            }
          }));
        }
      }),
      catchError((error) => {
        this.userState.update(state => ({
          ...state,
          result: {
            state: true,
            loading: false,
            error: error.error?.error || 'Error al borrar like'
          }
        }));
        return of(null); 
      })
    ).subscribe();
  }

  isLiked(id: string): void {

    this.userState.update(state => ({
      ...state,
      result: {
        state: false,
        loading: true,
        error: null
      }
    }));

    withAuthRetry<{ liked: boolean }>(() =>
      this.http.get<{ liked: boolean }>(`${this.apiUrl}/user/like/${id}`,
      {withCredentials: true}),
      this.authService
    ).pipe(
      tap({
        next: (result) => {
          this.userState.update(state => ({
            ...state,
            result: {
              state: result.liked,
              loading: false,
              error: null
            }
          }));
        }
      }),
      catchError((error) => {
        this.userState.update(state => ({
          ...state,
          result: {
            state: false,
            loading: false,
            error: error.error?.error || 'Error al verificar likes'
          }
        }));
        return of(null); 
      })
    ).subscribe();
  }
}
  
 
