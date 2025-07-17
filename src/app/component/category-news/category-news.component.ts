import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NewsService } from '../../service/news.service';
import { Category, getCategoryNameFromValue } from '../../enum/category';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../service/auth.service';


@Component({
  selector: 'app-category-news',
  imports: [RouterModule, CommonModule],
  templateUrl: './category-news.component.html',
  styleUrl: './category-news.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryNewsComponent {
  
  private router = inject(Router);
  route = inject(ActivatedRoute);
  newsService = inject(NewsService);
  authService = inject(AuthService);

  readonly pageSize = 9;
  currentPageSignal = signal(1);
  category = null as Category | null;

  currentPage = computed(() => this.currentPageSignal());
  totalPages = computed(() => Math.ceil(this.newsService.state().categoryNews.total / this.pageSize));

  currentPageNews = computed(() => {
    const page = this.currentPage();
    const newsMap = this.newsService.state().categoryNews.data;
    
    return newsMap.get(page) || [];
  });

  currentCategory = computed(() => {
    return this.newsService.state().categoryNews.currentCategory;
  });

  private paramSubscription = this.route.paramMap.pipe(takeUntilDestroyed()).subscribe(params => {
      const categoryParam = params.get('category');

      if (categoryParam && Object.values(Category).includes(categoryParam as Category)) {
        this.category = categoryParam as Category;
        if (this.currentCategory() !== this.category) {
          this.newsService.getCategory(this.category, this.pageSize, 0);
        }        
      } else {
        console.error(`Categoría inválida: "${categoryParam}"`);
        this.router.navigate(["/error"]);
        return;
      }
  });

  private isPageLoaded(page: number): boolean {
    return this.newsService.state().categoryNews.data.has(page)
  }

  private loadPage(page: number): void {
    if (!this.isPageLoaded(page)) {
      const offset = (page - 1) * this.pageSize
      this.newsService.getCategory(this.category!, this.pageSize, offset)
    }
  }

  getCategoryName(category: string | null | undefined): string {
    if (!category) {
      return ""
    }

    let aux = getCategoryNameFromValue(category)
    if (!aux) {
      aux = ""
    }
    return aux
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      const nextPage = this.currentPage() + 1
      this.currentPageSignal.set(nextPage)
      this.loadPage(nextPage)
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      const prevPage = this.currentPage() - 1
      this.currentPageSignal.set(prevPage)
      this.loadPage(prevPage)
    }
  }

  getVisiblePages(): (number | string)[] {
    const current = this.currentPage()
    const total = this.totalPages()
    const pages: (number | string)[] = []

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i)
      }
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i)
        pages.push("...")
        pages.push(total)
      } else if (current >= total - 3) {
        pages.push(1)
        pages.push("...")
        for (let i = total - 4; i <= total; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push("...")
        for (let i = current - 1; i <= current + 1; i++) pages.push(i)
        pages.push("...")
        pages.push(total)
      }
    }

    return pages
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPageSignal.set(page)
      this.loadPage(page)
    }
  }

  retry(): void {
    const offset = (this.currentPage() - 1) * this.pageSize
    this.newsService.getCategory(this.category!, this.pageSize, offset)
  }
}

