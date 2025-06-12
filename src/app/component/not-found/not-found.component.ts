import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {

  searchQuery: string = '';
  popularNews: any[] = [];
  categories: any[] = [];

  constructor(
    private router: Router,
    private titleService: Title,
    private metaService: Meta
  ) { }

  ngOnInit(): void {
    // Establecer título y meta descripción para SEO
    this.titleService.setTitle('Página no encontrada | NoticiasDiarias');
    this.metaService.updateTag({ 
      name: 'description', 
      content: 'Lo sentimos, la página que estás buscando no existe o ha sido movida.' 
    });
    
    // Cargar noticias populares
    this.loadPopularNews();
    
    // Cargar categorías
    this.loadCategories();
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/buscar'], { 
        queryParams: { q: this.searchQuery.trim() } 
      });
    }
  }

  loadPopularNews(): void {
    // En un caso real, aquí harías una llamada a un servicio para obtener las noticias populares
    // Por ahora, usamos datos de ejemplo
    this.popularNews = [
      {
        id: 1,
        title: 'La inteligencia artificial generativa está transformando todas las industrias',
        excerpt: 'Descubre cómo la IA generativa está cambiando la forma en que trabajamos y nos comunicamos.',
        imageUrl: '/assets/images/news1.jpg',
        category: 'Tecnología',
        publishDate: new Date(Date.now() - 3600000 * 24),
        author: 'María González'
      },
      {
        id: 2,
        title: 'Acuerdo histórico alcanzado en la cumbre internacional sobre cambio climático',
        excerpt: 'Los líderes mundiales han llegado a un consenso sin precedentes para reducir las emisiones de carbono.',
        imageUrl: '/assets/images/news2.jpg',
        category: 'Política',
        publishDate: new Date(Date.now() - 3600000 * 48),
        author: 'Carlos Rodríguez'
      },
      {
        id: 3,
        title: 'La selección nacional clasifica a la final del torneo continental',
        excerpt: 'Un gol en el último minuto aseguró el pase a la final después de un partido lleno de emoción.',
        imageUrl: '/assets/images/news3.jpg',
        category: 'Deportes',
        publishDate: new Date(Date.now() - 3600000 * 72),
        author: 'Ana Martínez'
      }
    ];
  }

  loadCategories(): void {
    // En un caso real, aquí harías una llamada a un servicio para obtener las categorías
    // Por ahora, usamos datos de ejemplo
    this.categories = [
      { name: 'Política', slug: 'politica' },
      { name: 'Economía', slug: 'economia' },
      { name: 'Deportes', slug: 'deportes' },
      { name: 'Tecnología', slug: 'tecnologia' },
      { name: 'Cultura', slug: 'cultura' },
      { name: 'Ciencia', slug: 'ciencia' },
      { name: 'Salud', slug: 'salud' },
      { name: 'Entretenimiento', slug: 'entretenimiento' }
    ];
  }
}
