import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthInput, Session, UserInput } from '../schema/user';
import { Role } from '../enum/role';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:1234';
  private http = inject(HttpClient);
  
  register(user: UserInput): Observable<Session> {
    return this.http.post<Session>(
      `${this.apiUrl}/auth/register`,
      {user}, { withCredentials: true }
    );
  }

  logIn(auth: AuthInput): Observable<Session> {
    return this.http.post<Session>(
      `${this.apiUrl}/auth/login`,
      {auth}, { withCredentials: true }
    );
  }

  logOut(): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/auth/logout`,
      {}, { withCredentials: true }
    );
  }

  refresh(): Observable<Session> {
    return this.http.post<Session>(
      `${this.apiUrl}/auth/refresh`,
      {}, { withCredentials: true }
    );
  }

  newPassword(oldPass: string, newPass: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/auth/password`,
      {oldPass, newPass}, { withCredentials: true }
    );
  }

  newRole(id: string, role: Role): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/auth/role`,
      {id, role}, { withCredentials: true }
    );
  }

}
