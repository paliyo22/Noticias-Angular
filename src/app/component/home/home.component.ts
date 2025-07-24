import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FeaturedNewsComponent } from '../featured-news/featured-news.component';
import { getCategoryNameFromValue } from '../../enum/category';
import { RouterModule } from '@angular/router';
import { NewsService } from '../../service/news.service';

@Component({
  selector: 'app-home',
  imports: [ 
    RouterModule, CommonModule,
    FeaturedNewsComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush         
})

export class HomeComponent implements OnInit {
  newsService = inject(NewsService);
  readonly pageSize = 9;
  currentPageSignal = signal(1);

  currentPage = computed(() => this.currentPageSignal());
  totalPages = computed(() => Math.ceil(this.newsService.state().news.total / this.pageSize));

  currentPageNews = computed(() => {
    const page = this.currentPage();
    const newsMap = this.newsService.state().news.data;
    
    return newsMap.get(page) || [];
  })

  ngOnInit(): void {
    this.currentPageSignal.set(1);
    if(this.newsService.state().news.data.size === 0){
      this.newsService.getNews(this.pageSize, 0);
    }
  }

  private isPageLoaded(page: number): boolean {
    return this.newsService.state().news.data.has(page);
  }
 
  private loadPage(page: number): void {
    if (!this.isPageLoaded(page)) {
      const offset = (page - 1) * this.pageSize
      this.newsService.getNews(this.pageSize, offset)
    }
  }

  getCategory(category: string | undefined): string {
    if(!category){
      return '';
    }
    
    let aux = getCategoryNameFromValue(category);
    if(!aux){
      aux = '';
    }
    return aux;
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
    const current = this.currentPage();
    const total = this.totalPages();
    const pages: (number | string)[] = [];
    
    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 5) {
        for (let i = 1; i <= 6; i++) pages.push(i);
        pages.push('...');
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = total - 5; i <= total; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = current - 5; i <= current + 5; i++) pages.push(i);
        pages.push('...');
        pages.push(total);
      }
    }
    
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPageSignal.set(page);
      this.loadPage(page);
    }
  }

  // Reintentar en caso de error
  retry(): void {
    const offset = (this.currentPage() - 1) * this.pageSize
    this.newsService.getNews(this.pageSize, offset)
  } 
  
}
