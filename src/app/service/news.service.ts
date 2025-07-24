import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { NewsOutput } from '../schema/news';
import { Category } from '../enum/category';
import { withAuthRetry } from '../helper/http-helper';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private apiUrl = 'https://server-news-project.onrender.com';
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  
  state = signal({
    news: { 
      data: new Map<number, NewsOutput[]>(), 
      total: 0, 
      loading: false,
      error: null as string | null 
    },
    inactive: {
      data: new Map<number, NewsOutput[]>(),
      total: 0,
      loading: false,
      error: null as string | null
    },
    featured: { 
      data: [] as NewsOutput[], 
      loading: false,
      error: null as string | null 
    },
    categoryNews: {
      data: new Map<number, NewsOutput[]>(), 
      total: 0, 
      loading: false,
      error: null as string | null,
      currentCategory: null as Category | null 
    },
    singleNews: {
      data: null as NewsOutput | null,
      subData: [] as NewsOutput[] | null,
      loading: false,
      error: null as string | null
    },
    search: {
      data: null as NewsOutput[] | null,
      loading: false,
      error: null as string | null
    }
  });

  getNews(limit?: number, offset?: number): void {
    let params = new HttpParams();
    
    if (limit !== undefined) {
      params = params.set('limit', limit.toString());
    }
    if (offset !== undefined) {
      params = params.set('offset', offset.toString());
    }

    this.state.update(state => ({
      ...state,
      news: {
        ...state.news,
        loading: true,
        error: null
      }
    }));

    this.http.get<{ news: {data: NewsOutput[], total: number} }>(`${this.apiUrl}/news`, { params })
    .pipe(
      tap({
        next: (response) => {
          this.state.update(state => {
            const newItemsMap = new Map(state.news.data);
            const page = Math.floor((offset || 0) / (limit || 9)) + 1;

            if (offset === 0) {
              newItemsMap.clear();
            }
            
            newItemsMap.set(page, response.news.data);
            
            return {
              ...state,
              news: {
                ...state.news,
                data: newItemsMap,
                total: response.news.total,
                loading: false,
                error: null
              }
            };
          });
        }
      }),
      catchError((error) => {
        this.state.update(state => ({
          ...state,
          news: {
            ...state.news,
            loading: false,
            error: error.error?.error || 'Error al cargar noticias'
          }
        }));
        return of(null); 
      })
    ).subscribe();
  }

  getInactive(limit?: number, offset?: number): void {
    let params = new HttpParams();

    if (limit !== undefined) {
      params = params.set('limit', limit.toString());
    }
    if (offset !== undefined) {
      params = params.set('offset', offset.toString());
    }

    this.state.update(state => ({
      ...state,
      inactive: {
        ...state.inactive,
        loading: true,
        error: null
      }
    }));

    withAuthRetry<{ news: {data: NewsOutput[], total: number} }>(() =>
      this.http.get<{ news: {data: NewsOutput[], total: number} }>(`${this.apiUrl}/news/inactive`, 
      {params, withCredentials: true }),
      this.authService
    ).pipe(
      tap({
        next: (response) => {
          this.state.update(state => {
            const newItemsMap = new Map(state.inactive.data);
            const page = Math.floor((offset || 0) / (limit || 9)) + 1;
            
            // Si offset = 0, limpiar todo el Map
            if (offset === 0) {
              newItemsMap.clear();
            }
            
            newItemsMap.set(page, response.news.data);
                        
            return {
              ...state,
              inactive: {
                ...state.inactive,
                data: newItemsMap,
                total: response.news.total,
                loading: false,
                error: null
              }
            };
          });
        }
      }),
      catchError((error) => {
        this.state.update(state => ({
          ...state,
          inactive: {
            ...state.inactive,
            loading: false,
            error: error.error?.error || 'Error al cargar noticias'
          }
        }));
        return of(null); 
      })
    ).subscribe();
  }
  
  getFeatured(limit?: number): void{
    let params = new HttpParams();

    if (limit !== undefined) {
      params = params.set('limit', limit.toString());
    }

    this.state.update(state => ({
      ...state,
      featured: {
        ...state.featured,
        loading: true,
        error: null
      }
    }));

    this.http.get<{ news: NewsOutput[] }>(`${this.apiUrl}/news/featured`, {params})
    .pipe(
      tap({
        next: (response) => {
          this.state.update(state => ({
            ...state,
            featured: {
              data: response.news,
              loading: false,
              error: null
            }
          }));
        }
      }),
      catchError((error) => {
        this.state.update(state => ({
          ...state,
          featured: {
            ...state.featured,
            loading: false,
            error: error.error?.error || 'Error al cargar noticias'
          }
        }));
        return of(null); 
      })
    ).subscribe();
  }

  getById(id: string): void {

    this.state.update(state => ({
      ...state,
      singleNews: {
        ...state.singleNews,
        loading: true,
        error: null
      }
    }));

    this.http.get<{news: NewsOutput, subNews?: NewsOutput[]}>(`${this.apiUrl}/news/${id}`)
    .pipe(
      tap({
        next: (response) => {
          const subInfo= response.subNews || null;

          this.state.update(state => ({
            ...state,
            singleNews: {
              data: response.news,
              subData: subInfo,
              loading: false,
              error: null
            }
          }));
        }
      }),
      catchError((error) => {
          this.state.update(state => ({
            ...state,
            singleNews: {
              ...state.singleNews,
              loading: false,
              error: error.error?.error || 'Error al cargar noticias'
            }
          }));
        return of(null); 
      })
    ).subscribe();
  }

  changeStatus(id: string): void {
    this.state.update(state => ({
      ...state,
      news: { ...state.news, loading: true },
      inactive: { ...state.inactive, loading: true }
    }));

    withAuthRetry<void>(() => 
      this.http.post<void>(`${this.apiUrl}/news/${id}`, {}, { withCredentials: true }),
      this.authService
    ).pipe(
      tap({
        next: () => {
          this.state.update(state => {
            const newsMap = new Map(state.news.data);       
            newsMap.clear();                 
            this.getInactive();
            
            return {
              ...state,
              news: {
                ...state.news,
                data: newsMap,
                loading: false,
                error: null
              }
            };
          });
        }
      }),
      catchError((error) => {
          this.state.update(state => ({
            ...state,
            news: {
              ...state.news,
              loading: false,
              error: error.error?.error || 'Error al cambiar estado'
            },
            inactive: {
              ...state.inactive,
              loading: false,
              error: error.error?.error || 'Error al cambiar estado'
            }
          }));
        return of(null); 
      })
    ).subscribe();
  }

  clean(password: string): void {
    this.state.update(state => ({
      ...state,
      inactive: {
        ...state.inactive,
        loading: true,
        error: null
      }
    }));

    withAuthRetry<{ message: string }>(() =>
      this.http.delete<{ message: string }>(`${this.apiUrl}/news/clean`, {body: {password}, withCredentials: true}),
      this.authService
    ).pipe(
      tap({
        next: (response) => {
          this.state.update(state => ({
            ...state,
            inactive: {
              data: new Map<number, NewsOutput[]>(),
              total: 0,
              loading: false,
              error: null
            }
          }));
          this.getInactive();
          console.log(response.message);
        }
      }),
      catchError((error) => {
        this.state.update(state => ({
            ...state,
            inactive: {
              ...state.inactive,
              loading: false,
              error: error.error?.error|| 'Error al limpiar noticias'
            }
          }));
          if(error.status === 401){
            this.authService.setState();
          }
        return of(null); 
      })
    ).subscribe();
  }

  getCategory(category: Category, limit?: number, offset?: number): void {
    let params = new HttpParams();

    if (limit !== undefined) {
      params = params.set('limit', limit.toString());
    }
    if (offset !== undefined) {
      params = params.set('offset', offset.toString());
    }
    
    this.state.update(state => ({
      ...state,
      categoryNews: {
        ...state.categoryNews,
        loading: true,
        error: null
      }
    }));
    
    this.http.get<{ news: { data: NewsOutput[], total: number } }>(`${this.apiUrl}/news/category/${category}`, {params})
    .pipe(
      tap({
        next: (response) => {
          this.state.update(state => {
            const newItemsMap = new Map(state.categoryNews.data);
            const page = Math.floor((offset || 0) / (limit || 9)) + 1;
            
            if (offset === 0) {
              newItemsMap.clear();
            }
            
            newItemsMap.set(page, response.news.data);
           
            return {
              ...state,
              categoryNews: {
                data: newItemsMap,
                total: response.news.total,
                currentCategory: category,
                loading: false,
                error: null
              }
            };
          });
        }
      }),
      catchError((error) => {
        this.state.update(state => ({
          ...state,
          categoryNews: {
            ...state.categoryNews,
            loading: false,
            error: error.error?.error || 'Error al cargar noticias'
          }
        }));
        return of(null); 
      })
    ).subscribe();
  } 

  fetchApi(): void {
    withAuthRetry<void>(() =>
      this.http.post<void>(`${this.apiUrl}/news/fetch`, {}, {withCredentials: true}),
      this.authService
    ).pipe(
      tap({
        next: () => {
          console.log('Se cargo todo correctamente');
        }
      }),
      catchError((error) => {
        const aux = error.error?.error || 'Error al cargar noticias desde la api';
        console.error(aux);
        return of(null); 
      })
    ).subscribe()
  }

  search(contain: string): void {

    this.state.update(state => ({
      ...state,
      search: {
        data: null,
        loading: true,
        error: null
      }
    }));

    this.http.post<{news: NewsOutput[]}>(`${this.apiUrl}/news/search`, {contain})
    .pipe(
      tap({
        next: (response) => {
          this.state.update((state) => ({
            ...state,
            search: {
              data: response.news,
              loading: false,
              error: null
            }
          }));
        }
      }),
      catchError((error) => {
          this.state.update((state) => ({
            ...state,
            search: {
              data: null,
              loading: false,
              error: error.error?.error || 'Error al cargar noticias'
            }
          }));
        return of(null); 
      })
    ).subscribe();
  }
}

