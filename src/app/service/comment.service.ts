import { inject, Injectable, signal } from '@angular/core';
import { CommentOutput } from '../schema/comment';
import { catchError, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { withAuthRetry } from '../helper/http-helper';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private apiUrl = 'https://server-news-project.onrender.com';
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  commentState = signal({
    comment: {
      data: new Map<string, {comment: CommentOutput, replies: CommentOutput[]}>(),
      likes: new Map<string, string[]>(),
      loading: false,
      error: null as string | null
    },
    result: {
      state: false,
      loading: false,
      error: null as string | null
    }
  });

  getComments(id: string): void {

    this.commentState.update(state => ({
      ...state,
      comment: {
        data: new Map<string, {comment: CommentOutput, replies: CommentOutput[]}>(),
        likes: new Map<string, string[]>(),
        loading: true,
        error: null
      }
    }));

    this.http.get<{comments: CommentOutput[]}>(`${this.apiUrl}/comment/${id}`)
    .pipe(
      tap({
        next: (result) => {
          this.commentState.update(state => {
            const newItemsMap = new Map(state.comment.data);
            
            result.comments.forEach(comment => {
              newItemsMap.set(comment.id!, {
                comment: comment, 
                replies: []
              });
            });

            return {
              ...state,
              comment: {
                ...state.comment,
                data: newItemsMap,
                loading: false,
              }
            }
          });
          this.getLikes();
        }
      }),
      catchError((error) => {
        this.commentState.update(state => ({
          ...state,
          comment: {
            ...state.comment,
            loading: false,
            error: error.error?.error || 'Error cargando comentarios'
          }
        }));
        return of(null); 
      })
    ).subscribe();
  } 

  getLikes(): void {
    const commentsId: string[] = [];

    this.commentState().comment.data.forEach(({ comment, replies }) => {
      if (comment.id) commentsId.push(comment.id);
      for (const reply of replies) {
        if (reply.id) commentsId.push(reply.id);
      }
    });

    this.commentState.update(state => ({
      ...state,
      comment: {
        ...state.comment,
        loading: true,
        error: null
      }
    }));

    this.http.post<Record<string, string[]>>(`${this.apiUrl}/comment/likes/batch`,{comments: commentsId})
    .pipe(
      tap({
        next: (result) => {
          this.commentState.update(state => ({
            ...state,
            comment: {
              ...state.comment,
              likes: new Map(Object.entries(result)),
              loading: false
            }
          }));
        }
      }),
      catchError((error) => {
        // Maneja error Y evita que se propague
        this.commentState.update(state => ({
          ...state,
          comment: {
            ...state.comment,
            loading: false,
            error: error.error?.error || 'Error cargando los likes'
          }
        }));
        return of(null); // Retorna valor válido para continuar el stream
      })
    ).subscribe();
  }
  
  getReplies(id: string): void {

    this.commentState.update(state => ({
      ...state,
      comment: {
        ...state.comment,
        loading: true,
        error: null
      }
    }));

    this.http.get<{comment: CommentOutput[]}>(`${this.apiUrl}/comment/replies/${id}`)
    .pipe(
      tap({
        next: (result) => {
          this.commentState.update(state => {
            const newItemsMap = new Map(state.comment.data);
            const currentComment =  newItemsMap.get(id);
                        
            newItemsMap.set(id, {comment: currentComment!.comment, replies: result.comment});

            return {
              ...state,
              comment: {
                ...state.comment,
                data: newItemsMap,
                loading: false,
              }
            }
          });
          this.getLikes();
        }
      }),
      catchError((error) => {
        this.commentState.update(state => ({
            ...state,
            comment: {
              ...state.comment,
              loading: false,
              error: error.error?.error || 'Error obteniendo las respuestas'
            }
        }));
        return of(null); 
      })
    ).subscribe();
  }
  
  addLike(id: string): void {
    this.commentState.update(state => ({
      ...state,
      result: { 
        state: false, 
        loading: true, 
        error: null 
      }
    }));
    
    withAuthRetry<void>(() =>
      this.http.post<void>(`${this.apiUrl}/comment/like/${id}`, {}, {withCredentials: true}),
      this.authService
    ).pipe(
      tap({
        next: () => {
          this.getLikes();
          this.commentState.update(state => ({
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
        this.commentState.update(state => ({
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

  deleteLikes(id: string): void {

    this.commentState.update(state => ({
      ...state,
      result: {
        state: false,
        loading: true,
        error: null
      }
    }));

    withAuthRetry<void>(() =>
      this.http.delete<void>(`${this.apiUrl}/comment/like/${id}`, {withCredentials: true}),
      this.authService
    ).pipe(
      tap({
        next: () => {
          this.getLikes();
          this.commentState.update(state => ({
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
        this.commentState.update(state => ({
          ...state,
          result: { 
            state: false, 
            loading: false, 
            error: error.error?.error || 'Error al borrar like' 
          }
        }));
        return of(null); 
      })
    ).subscribe();
  }
 
  addComment(newsId: string, comment: string, parentCommentId?: string): void {

    withAuthRetry<void>(() =>
      this.http.post<void>(`${this.apiUrl}/comment/${newsId}`, 
      {comment, parentCommentId}, {withCredentials: true}),
      this.authService
    ).pipe(
      tap({
        next: () => {
          this.getComments(newsId);
        }
      }),
      catchError((error) => {
        this.commentState.update(state => ({
          ...state,
          comment: {
            ...state.comment,
            loading: false, 
            error: error.error?.error || 'Error al guardar comentario'
          }
        }));
        return of(null); 
      })
    ).subscribe();
  }

  updateComment(newsId: string, commentId: string, comment: string): void {
    
    this.commentState.update(state => ({
      ...state,
      comment: {
        ...state.comment,
        loading: true,
        error: null
      }
    }));

    withAuthRetry<void>(() =>
      this.http.patch<void>(`${this.apiUrl}/comment/${commentId}`, {comment: comment}, {withCredentials: true}),
      this.authService
    ).pipe(
      tap({
        next: () => {
          this.getComments(newsId);
        }
      }),
      catchError((error) => {
        this.commentState.update(state => ({
          ...state,
          comment: {
            ...state.comment,
            loading: false, 
            error: error.error?.error || 'Error al actualizar' 
          }
        }));
        return of(null); 
      })
    ).subscribe()
  }

  deleteComment(newsId: string, commentId: string): void {

    this.commentState.update(state => ({
      ...state,
      comment: {
        ...state.comment,
        loading: true,
        error: null
      }
    }));

    withAuthRetry<void>(() =>
      this.http.delete<void>(`${this.apiUrl}/comment/${commentId}`, {withCredentials: true}),
      this.authService
    ).pipe(
      tap({
        next: () => {
          this.getComments(newsId);
        },
      }),
      catchError((error) => {
        this.commentState.update(state => ({
          ...state,
          comment: {
            ...state.comment,
            loading: false, 
            error: error.error?.error || 'Error borrando comentario' 
          }
        }));
        return of(null); 
      })
    ).subscribe();
  }
}

