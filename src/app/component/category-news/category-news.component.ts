import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BehaviorSubject, combineLatest, map, Observable, of, switchMap, withLatestFrom } from 'rxjs';
import { NewsOutput } from '../../schema/news';
import { NewsService } from '../../service/news.service';
import { Category } from '../../enum/category';

@Component({
  selector: 'app-category-news',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './category-news.component.html',
  styleUrl: './category-news.component.scss'
})
export class CategoryNewsComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private newsService = inject(NewsService);

  private currentPageSubject = new BehaviorSubject<number>(1);
  currentPage$ = this.currentPageSubject.asObservable();

  private categorySubject = new BehaviorSubject<Category | null>(null);
  category$ = this.categorySubject.asObservable();

  totalPages: number = 1;
  categoryName: string = ''; // 👈 nombre para mostrar

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const categoryParam = params.get('category');
      if (categoryParam && Object.values(Category).includes(categoryParam as Category)) {
        const cat = categoryParam as Category;
        this.categorySubject.next(cat);
        this.categoryName = this.getCategoryLabel(cat); // 👈 traducir a nombre legible
      } else {
        console.error(`Categoría inválida: "${categoryParam}"`);
        this.categorySubject.next(null);
      }
    });

    this.totalPages$.subscribe(tp => this.totalPages = tp);
  }

  // ✅ Lógica para obtener noticias (12 por página)
  newsResponse$: Observable<{ data: NewsOutput[]; total: number }> = combineLatest([
    this.currentPage$,
    this.category$
  ]).pipe(
    switchMap(([page, category]) => {
      if (!category) return of({ data: [], total: 0 });
      const limit = 12;
      const offset = (page - 1) * limit;
      return this.newsService.getCategory(category, limit, offset);
    })
  );

  newsList$: Observable<NewsOutput[]> = this.newsResponse$.pipe(
    map(res => res.data)
  );

  totalPages$: Observable<number> = this.newsResponse$.pipe(
    map(res => Math.ceil(res.total / 12))
  );

  getVisiblePages(currentPage: number): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(this.totalPages);
      } else if (currentPage >= this.totalPages - 2) {
        pages.push(1, '...');
        for (let i = this.totalPages - 3; i <= this.totalPages; i++) pages.push(i);
      } else {
        pages.push(1, '...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...', this.totalPages);
      }
    }
    return pages;
  }

  goToPage(page: number | string): void {
    if (typeof page === 'number') this.currentPageSubject.next(page);
  }

  goToPreviousPage(): void {
    const current = this.currentPageSubject.value;
    if (current > 1) this.currentPageSubject.next(current - 1);
  }

  goToNextPage(): void {
    const current = this.currentPageSubject.value;
    if (current < this.totalPages) this.currentPageSubject.next(current + 1);
  }

  // ✅ Traduce categoría al nombre legible
  getCategoryLabel(cat: Category): string {
    switch (cat) {
      case Category.Entretenimiento: return 'Entretenimiento';
      case Category.Internacional: return 'Internacional';
      case Category.Empresarial: return 'Empresarial';
      case Category.Salud: return 'Salud';
      case Category.Deportes: return 'Deportes';
      case Category.Ciencia: return 'Ciencia';
      case Category.Tecnologia: return 'Tecnología';
      default: return '';
    }
  }
}

