import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserInput, UserOutput } from '../schema/user';
import { CommentOutput } from '../schema/comment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
   
  private apiUrl = 'http://localhost:1234';
  private http = inject(HttpClient);
  
  getInfo(): Observable<UserOutput> {
    return this.http.get<UserOutput>(
      `${this.apiUrl}/user/`,
      { withCredentials: true }
    );
  }

  getAll(): Observable<UserOutput[]> {
    return this.http.get<UserOutput[]>(
      `${this.apiUrl}/user/getall`, { withCredentials: true })
      .pipe(map(news => { return news }));
  }

  getUser(id: string): Observable<UserOutput> {
    return this.http.get<UserOutput>(
      `${this.apiUrl}/user/${id}`, 
      { withCredentials: true });
  }

  update(user: Partial<UserInput>): Observable<UserOutput>{
    return this.http.patch<UserOutput>(`${this.apiUrl}/user/update`,
      {user}, {withCredentials: true}
    );
  }

  delete(): Observable<void>{
    return this.http.post<void>(`${this.apiUrl}/user/delete`,
      {withCredentials: true}
    );
  }

  clean(): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/user/erase`,
      {withCredentials: true}
    );
  }

  addNewsLike(id: string): Observable<void>{
    return this.http.post<void>(`${this.apiUrl}/user/like/${id}`,
      {}, {withCredentials: true}
    );
  }

  addComment(id: string, comment: string, parentCommentId: string): Observable<CommentOutput>{
    return this.http.post<CommentOutput>(`${this.apiUrl}/user/comment/${id}`,
      {comment, parentCommentId}, {withCredentials: true}
    );
  }

  deleteComment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/user/comment/${id}`,
      {withCredentials: true}
    )
  }

  deleteLike(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/user/like/${id}`,
      {withCredentials: true}
    )
  }
}
  
 
