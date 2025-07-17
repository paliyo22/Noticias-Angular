import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NewsService } from '../../service/news.service';
import { AuthService } from '../../service/auth.service';
import { UserService } from '../../service/user.service';
import { CommentComponent } from "../comment/comment.component";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { getCategoryNameFromValue } from '../../enum/category';
import { FeaturedNewsComponent } from '../featured-news/featured-news.component';


@Component({
  selector: 'app-news',
  imports: [
    RouterModule, CommonModule, 
    CommentComponent, FeaturedNewsComponent
  ],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsComponent {
  
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private idParam: string | null = '';

  newsService = inject(NewsService);
  authService = inject(AuthService);
  userService = inject(UserService);
 
  isCurrentlyLiked = computed(() => {
    return this.userService.userState().result.state;
  });

  logState = computed(() => {
    return this.authService.authState().logged;
  });

  private paramSubscription = this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
    this.idParam = params.get("id")

    if (!this.idParam?.trim()) {
      console.error("ID de noticia no válido, redirigiendo a error")
      this.router.navigate(["/error"])
      return
    }

    this.newsService.getById(this.idParam)

    if (this.logState()) {
      this.userService.isLiked(this.idParam)
    }
  })

  toggleLike(): void {
    if (!this.logState() || !this.idParam) {
      console.error("Usuario no logueado o ID inválido")
      return
    }

    if (this.isCurrentlyLiked()) {
      this.userService.deleteLike(this.idParam)
    } else {
      this.userService.addLike(this.idParam)
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

  retry(): void {
    if (this.idParam) {
      this.newsService.getById(this.idParam)
    }
  }
  
  shareArticle(): void {
    const news = this.newsService.state().singleNews.data;
    if (!news) return;

    if (navigator.share) {
      navigator.share({
        title: news.title,
        text: news.snippet,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback: copiar URL al portapapeles
      navigator.clipboard.writeText(window.location.href).then(() => {
        // Mostrar notificación de éxito
        console.log('URL copiada al portapapeles');
      }).catch(console.error);
    }
  }

  openNewsUrl(event: Event, url: string): void {
    event.preventDefault()
    event.stopPropagation()

    if (!url) {
      console.warn("URL no válida")
      return
    }

    try {
      const newWindow = window.open(url, "_blank", "noopener,noreferrer")

      if (newWindow && !newWindow.closed) {
        newWindow.focus()
      } 
    } catch (error) {
      if (confirm("Error al abrir el enlace. ¿Deseas intentar abrirlo en esta pestaña?")) {
        window.location.href = url
      }
    }
  }
}    