import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { tap, catchError, of } from 'rxjs';
import { CommentOutput } from '../../schema/comment';
import { NewsService } from '../../service/news.service';
import { SessionService } from '../../service/session.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-comment',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent implements OnInit {
  private newsService = inject(NewsService);
  private userService = inject(UserService);
  private sessionService = inject(SessionService);

  @Input() newsId!: string;

  comments: CommentOutput[] = [];
  newComment: string = '';
  loggedIn: boolean = false;

  ngOnInit(): void {
    this.loadComments();

    this.sessionService.isLoggedIn().subscribe(isLogged => {
      this.loggedIn = isLogged;
    });
  }

  loadComments(): void {
    if (!this.newsId) return;

    this.newsService.getNewsComments(this.newsId).pipe(
      tap(comments => this.comments = comments),
      catchError(err => {
        console.error('Error cargando comentarios:', err);
        return of([]);
      })
    ).subscribe();
  }

  onSubmit(): void {
  if (!this.loggedIn || !this.newComment.trim()) return;

  this.userService.addComment(this.newsId, this.newComment, '').pipe(
    tap((comment) => {
      this.comments.unshift(comment); // O puedes quitar esta línea si quieres solo reload
      this.newComment = '';
      
      // Recargar comentarios desde backend
      this.loadComments();
    }),
    catchError(err => {
      console.error('Error al publicar comentario:', err);
      return of(null);
    })
  ).subscribe();
}

}
