import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NewsService } from '../../service/news.service';

@Component({
  selector: 'app-featured-news',
  imports: [RouterModule, CommonModule],
  templateUrl: './featured-news.component.html',
  styleUrl: './featured-news.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturedNewsComponent implements OnInit{

  newsService = inject(NewsService);
  
  ngOnInit() {
    this.newsService.getFeatured(5);  
  }
  
}
