import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common"
import { ActivatedRoute, RouterLink } from "@angular/router"
import { NewsService } from "../../service/news.service"
import { FormsModule } from "@angular/forms"

@Component({
  selector: 'app-search',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {
  private route = inject(ActivatedRoute)
  newsService = inject(NewsService)

  searchQuery = ""

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const content = params.get("content")
      if (content) {
        this.searchQuery = content
        this.performSearch(content)
      }
    })
  }

  performSearch(query: string): void {
    this.newsService.search(query)
  }
  
}
