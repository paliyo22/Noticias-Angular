import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NewsOutput } from '../../schema/news';
import { NewsService } from '../../service/news.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-featured-news',
  imports: [RouterModule, CommonModule],
  templateUrl: './featured-news.component.html',
  styleUrl: './featured-news.component.scss'
})
export class FeaturedNewsComponent implements OnInit{

  newsService = inject(NewsService);

  featuredResponse$: Observable<NewsOutput[]> = this.newsService.getFeatured(4);

  news: NewsOutput[] = [];
  
  ngOnInit() {
    this.featuredResponse$.subscribe(fe => this.news = fe);  
  }

  
}
