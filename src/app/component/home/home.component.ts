import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FeaturedNewsComponent } from '../featured-news/featured-news.component';
import { RouterModule } from '@angular/router';
import { NewsService } from '../../service/news.service';
import { BehaviorSubject, combineLatest, map, Observable, switchMap, withLatestFrom } from 'rxjs';
import { NewsOutput } from '../../schema/news';
import { getCategoryNameFromValue } from '../../enum/category';


@Component({
  selector: 'app-home',
  imports: [ 
    RouterModule, CommonModule,
    FeaturedNewsComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit {
  newsService = inject(NewsService);

  private currentPageSubject = new BehaviorSubject<number>(1);
  currentPage$ = this.currentPageSubject.asObservable();
  limit = 10;

  // Traemos toda la respuesta (con likes incluidos)
  newsResponse$: Observable<{ data: NewsOutput[]; total: number }> = this.currentPage$.pipe(
    switchMap(page => {
      const limit = page === 1 ? 10 : 9;
      const offset = (page - 1) * limit;
      return this.newsService.getNews(limit, offset);
    })
  );


  // Lista completa de noticias de la página actual
  newsList$: Observable<NewsOutput[]> = this.newsResponse$.pipe(
    map(res => res.data)
  );

  // NOTICIA DESTACADA: para la página 1, la noticia con más likes, para otras páginas null
  mainStory$: Observable<NewsOutput | null> = this.newsList$.pipe(
    withLatestFrom(this.currentPage$),
    map(([newsList, currentPage]) => {
      if (currentPage !== 1 || newsList.length === 0) {
        return null;
      }
      // Encontrar noticia con más likes
      return newsList.reduce((max, item) => (item.likes > max.likes ? item : max), newsList[0]);
    })
  );

  // Noticias paginadas, excluyendo la noticia destacada solo en la página 1
  paginatedNews$: Observable<NewsOutput[]> = combineLatest([this.newsList$, this.mainStory$, this.currentPage$]).pipe(
    map(([newsList, mainStory, currentPage]) => {
      if (currentPage === 1 && mainStory) {
        // Excluir la noticia destacada
        return newsList.filter(news => news.id !== mainStory.id);
      }
      return newsList;
    })
  );

  totalPages$: Observable<number> = this.currentPage$.pipe(
    switchMap(page => {
      const limit = page === 1 ? 10 : 9;
      return this.newsResponse$.pipe(
        map(res => Math.ceil(res.total / limit))
      );
    })
  );

  totalPages: number = 1;

  ngOnInit() {
    this.totalPages$.subscribe(tp => this.totalPages = tp);
  }

  getVisiblePages(currentPage: number): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(this.totalPages);
      } else if (currentPage >= this.totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = this.totalPages - 3; i <= this.totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(this.totalPages);
      }
    }
    return pages;
  }

  goToPage(page: number | string): void {
    if (typeof page === 'number') {
      this.currentPageSubject.next(page);
    }
  }

  goToPreviousPage(): void {
    const current = this.currentPageSubject.value;
    if (current > 1) this.currentPageSubject.next(current - 1);
  }

  goToNextPage(): void {
    const current = this.currentPageSubject.value;
    if (current < this.totalPages) this.currentPageSubject.next(current + 1);
  }

  getCategoryName(categoryValue: string | undefined): string | undefined {
    if (!categoryValue) return undefined;
    return getCategoryNameFromValue(categoryValue);
  }
}
