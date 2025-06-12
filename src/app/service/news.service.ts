import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { NewsOutput } from '../schema/news';
import { CommentOutput } from '../schema/comment';
import { Category } from '../enum/category';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private apiUrl = 'http://localhost:1234';
  private http = inject(HttpClient);

  getNews(limit?: number, offset?: number): Observable<NewsOutput[]> {
    let params = new HttpParams();

    if (limit !== undefined) {
      params = params.set('limit', limit.toString());
    }
    if (offset !== undefined) {
      params = params.set('offset', offset.toString());
    }
    return this.http.get<NewsOutput[]>(`${this.apiUrl}/news`, {params})
      .pipe(map(news => {
        return news
      }));
  }

  getInactive(limit?: number, offset?: number): Observable<NewsOutput[]> {
    let params = new HttpParams();

    if (limit !== undefined) {
      params = params.set('limit', limit.toString());
    }
    if (offset !== undefined) {
      params = params.set('offset', offset.toString());
    }
    return this.http.get<NewsOutput[]>(`${this.apiUrl}/news/inactive`, {params, withCredentials: true })
      .pipe(map(news => {
        return news
      }));
  }
  
  getFeatured(limit?: number): Observable<NewsOutput[]> {
    let params = new HttpParams();

    if (limit !== undefined) {
      params = params.set('limit', limit.toString());
    }

    return this.http.get<NewsOutput[]>(`${this.apiUrl}/news/featured`, {params})
      .pipe(map(news => {
        return news
      }));
  }

  getById(id: string): Observable<NewsOutput> {

    return this.http.get<NewsOutput>(`${this.apiUrl}/news/${id}`)
      .pipe(map(news => {
        return news
      }));
  }

  changeStatus(id: string): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.apiUrl}/news/${id}`,
      {}, { withCredentials: true }
    );
  }

  clean(): Observable<{ message: string }> {
  return this.http.delete<{ message: string }>(
    `${this.apiUrl}/news/clean`,
    { withCredentials: true }
  );
}

  getReplies(id: number): Observable<CommentOutput[]> {
    return this.http.get<CommentOutput[]>(`${this.apiUrl}/news/replies/${id}`)
      .pipe(map(comment => {
        return comment
      }));
  }

  fetchApi(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/news/fetch`,{});
  } 

  getCategory(category: Category, limit?: number, offset?: number): Observable<NewsOutput[]> {
    let params = new HttpParams();

    if (limit !== undefined) {
      params = params.set('limit', limit.toString());
    }
    if (offset !== undefined) {
      params = params.set('offset', offset.toString());
    }
    return this.http.get<NewsOutput[]>(`${this.apiUrl}/news/${category}`, {params})
      .pipe(map(news => {
        return news
      }));
  } 
}
