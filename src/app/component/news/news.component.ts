import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommentComponent } from "../comment/comment.component";
import { NewsService } from '../../service/news.service';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { NewsOutput } from '../../schema/news';
import { UserService } from '../../service/user.service';
import { SessionService } from '../../service/session.service';

@Component({
  selector: 'app-news',
  imports: [RouterModule, FormsModule, CommonModule, CommentComponent],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private newsService = inject(NewsService);
  private userService = inject(UserService);
  private sessionService = inject(SessionService); // <-- nuevo
  
  newsData$!: Observable<{ news: NewsOutput; subNews?: NewsOutput[] }>;

  // Variables locales
  localLikes: number = 0;
  originalLikes: number = 0;
  userLiked: boolean = false;
  loggedIn: boolean = false;
  newsId: string = '';
  userInitiallyLiked: boolean = false;

  ngOnInit(): void {
    this.newsData$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');
        if (!id) return of({ news: {} as NewsOutput });

        this.newsId = id;

        return this.newsService.getById(id).pipe(
          tap(({ news }) => {
            this.localLikes = news.likes;
            this.originalLikes = news.likes;
          }),
          switchMap((data) =>
            this.sessionService.isLoggedIn().pipe(
              tap((isLogged) => {
                this.loggedIn = isLogged;
              }),
              switchMap((isLogged) => {
                if (!isLogged) return of(data);
                return this.userService.isLiked(this.newsId).pipe(
                  tap((isLiked) => (this.userLiked = isLiked)),
                  map(() => data)
                );
              })
            )
          )
        );
      })
    );
  }

  toggleLike(): void {
    this.sessionService.isLoggedIn().subscribe((isLogged) => {
      if (!isLogged) {
        alert('Debes iniciar sesión para dar like.');
        return;
      }

      this.loggedIn = true;

      if (this.userLiked) {
        if (this.localLikes > 0) this.localLikes--;
      } else {
        this.localLikes++;
      }

      this.userLiked = !this.userLiked;
    });
  }

  ngOnDestroy(): void {
    if (!this.loggedIn || this.userLiked === this.userInitiallyLiked) return;

    const likeAction = this.userLiked
      ? this.userService.addNewsLike(this.newsId)
      : this.userService.deleteLike(this.newsId);

    likeAction.subscribe({
      next: () => console.log('Like actualizado en backend'),
      error: (err) => console.error('Error al actualizar like:', err),
    });
  }
  
  openNewsUrl(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}