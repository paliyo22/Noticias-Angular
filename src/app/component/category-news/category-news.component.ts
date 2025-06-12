import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-category-news',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './category-news.component.html',
  styleUrl: './category-news.component.scss'
})
export class CategoryNewsComponent implements OnInit {

  // Parámetros recibidos
  category: string = '';
  categoryDescription: string = '';
  
  // Filtros y ordenación
  sortBy: string = 'recent';
  timeFrame: string = 'all';
  
  // Paginación
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 9;
  
  // Datos
  featuredNews: any[] = [];
  categoryNews: any[] = [];
  mostReadNews: any[] = [];
  
  // Suscripción
  showSubscribe: boolean = true;
  subscribeEmail: string = '';
  acceptTerms: boolean = false;
  
  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta
  ) { }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.category = params['category'];
      this.loadCategoryData();
      this.updateMetaTags();
    });
  }
  
  loadCategoryData(): void {
    // En un caso real, aquí harías una llamada a un servicio para obtener los datos
    // Por ahora, usamos datos de ejemplo
    
    // Descripción de la categoría
    this.setCategoryDescription();
    
    // Noticias destacadas
    this.featuredNews = this.getMockFeaturedNews();
    
    // Noticias de la categoría
    this.categoryNews = this.getMockCategoryNews();
    
    // Calcular total de páginas
    this.totalPages = Math.ceil(this.categoryNews.length / this.itemsPerPage);
    
    // Lo más leído
    this.mostReadNews = this.getMockMostReadNews();
  }
  
  setCategoryDescription(): void {
    switch (this.category.toLowerCase()) {
      case 'política':
        this.categoryDescription = 'Mantente informado sobre las últimas noticias políticas, elecciones, debates parlamentarios y decisiones gubernamentales a nivel nacional e internacional.';
        break;
      case 'economía':
        this.categoryDescription = 'Análisis económicos, mercados financieros, empresas, empleo y todas las claves para entender la actualidad económica.';
        break;
      case 'deportes':
        this.categoryDescription = 'Toda la actualidad deportiva: fútbol, baloncesto, tenis, Fórmula 1 y todos los deportes con noticias, resultados y análisis.';
        break;
      case 'tecnología':
        this.categoryDescription = 'Las últimas novedades en tecnología, gadgets, aplicaciones, internet y empresas tecnológicas.';
        break;
      case 'cultura':
        this.categoryDescription = 'Noticias sobre cine, música, literatura, arte y todas las expresiones culturales.';
        break;
      default:
        this.categoryDescription = `Todas las noticias relacionadas con ${this.category}.`;
    }
  }
  
  updateMetaTags(): void {
    this.titleService.setTitle(`${this.category} | NoticiasDiarias`);
    this.metaService.updateTag({ 
      name: 'description', 
      content: this.categoryDescription 
    });
  }
  
  applySorting(): void {
    // Aquí iría la lógica para ordenar las noticias
    console.log('Ordenando por:', this.sortBy);
    
    // Simulamos reordenamiento
    if (this.sortBy === 'popular') {
      this.categoryNews.sort((a, b) => b.views - a.views);
    } else if (this.sortBy === 'recent') {
      this.categoryNews.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
    }
  }
  
  applyFilters(): void {
    // Aquí iría la lógica para filtrar las noticias por periodo
    console.log('Filtrando por periodo:', this.timeFrame);
    
    // Simulamos filtrado
    this.loadCategoryData(); // Recargamos los datos
    
    const now = new Date();
    if (this.timeFrame === 'today') {
      this.categoryNews = this.categoryNews.filter(news => {
        const publishDate = new Date(news.publishDate);
        return publishDate.toDateString() === now.toDateString();
      });
    } else if (this.timeFrame === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      this.categoryNews = this.categoryNews.filter(news => {
        const publishDate = new Date(news.publishDate);
        return publishDate >= oneWeekAgo;
      });
    } else if (this.timeFrame === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      
      this.categoryNews = this.categoryNews.filter(news => {
        const publishDate = new Date(news.publishDate);
        return publishDate >= oneMonthAgo;
      });
    }
    
    // Recalcular total de páginas
    this.totalPages = Math.ceil(this.categoryNews.length / this.itemsPerPage);
    this.currentPage = 1; // Volver a la primera página
  }
  
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // Aquí iría la lógica para cargar las noticias de la página seleccionada
      console.log('Cambiando a página:', page);
    }
  }
  
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Si hay muchas páginas, mostrar un subconjunto
      let startPage = Math.max(1, this.currentPage - 2);
      let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
      
      // Ajustar si estamos cerca del final
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }
  
  subscribeToCategory(): void {
    // Aquí iría la lógica para suscribir al usuario a la categoría
    if (this.subscribeEmail && this.acceptTerms) {
      console.log('Suscribiendo a la categoría:', this.category);
      console.log('Email:', this.subscribeEmail);
      
      // Simulamos éxito
      alert(`Te has suscrito correctamente a la categoría ${this.category}`);
      this.subscribeEmail = '';
      this.acceptTerms = false;
    } else {
      alert('Por favor, completa todos los campos requeridos');
    }
  }
  
  // Métodos para generar datos de ejemplo
  
  getMockFeaturedNews(): any[] {
    return [
      {
        id: 1,
        title: `Noticia destacada de ${this.category}`,
        excerpt: `Esta es la noticia más importante de la categoría ${this.category} con toda la información relevante y actualizada.`,
        imageUrl: `/assets/images/${this.category.toLowerCase()}-featured.jpg`,
        publishDate: new Date(),
        author: 'María González',
        views: 1250
      },
      {
        id: 2,
        title: `Segunda noticia destacada de ${this.category}`,
        excerpt: `Otra noticia importante sobre ${this.category} que debes conocer.`,
        imageUrl: `/assets/images/${this.category.toLowerCase()}-featured2.jpg`,
        publishDate: new Date(Date.now() - 3600000 * 2),
        author: 'Carlos Rodríguez',
        views: 980
      },
      {
        id: 3,
        title: `Tercera noticia destacada de ${this.category}`,
        excerpt: `Más información relevante sobre ${this.category} para mantenerte informado.`,
        imageUrl: `/assets/images/${this.category.toLowerCase()}-featured3.jpg`,
        publishDate: new Date(Date.now() - 3600000 * 5),
        author: 'Ana Martínez',
        views: 820
      }
    ];
  }
  
  getMockCategoryNews(): any[] {
    const news = [];
    
    // Generamos 20 noticias de ejemplo
    for (let i = 1; i <= 20; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const hoursAgo = Math.floor(Math.random() * 24);
      const publishDate = new Date();
      publishDate.setDate(publishDate.getDate() - daysAgo);
      publishDate.setHours(publishDate.getHours() - hoursAgo);
      
      const views = Math.floor(Math.random() * 1000) + 100;
      
      let subcategory = '';
      if (this.category === 'Política') {
        subcategory = ['Nacional', 'Internacional', 'Elecciones', 'Parlamento'][Math.floor(Math.random() * 4)];
      } else if (this.category === 'Economía') {
        subcategory = ['Mercados', 'Empresas', 'Empleo', 'Fiscalidad'][Math.floor(Math.random() * 4)];
      } else if (this.category === 'Deportes') {
        subcategory = ['Fútbol', 'Baloncesto', 'Tenis', 'Fórmula 1'][Math.floor(Math.random() * 4)];
      } else if (this.category === 'Tecnología') {
        subcategory = ['Móviles', 'Apps', 'Gadgets', 'Internet'][Math.floor(Math.random() * 4)];
      } else if (this.category === 'Cultura') {
        subcategory = ['Cine', 'Música', 'Literatura', 'Arte'][Math.floor(Math.random() * 4)];
      }
      
      news.push({
        id: i + 10,
        title: `Noticia ${i} de ${this.category}: Título de ejemplo para mostrar en la lista`,
        excerpt: `Resumen de la noticia ${i} sobre ${this.category} con información relevante para el lector.`,
        imageUrl: `/assets/images/${this.category.toLowerCase()}${i % 5 + 1}.jpg`,
        publishDate: publishDate,
        author: ['María González', 'Carlos Rodríguez', 'Ana Martínez', 'Juan López'][i % 4],
        subcategory: subcategory,
        views: views
      });
    }
    
    return news;
  }
  
  getMockMostReadNews(): any[] {
    return [
      {
        id: 101,
        title: `La noticia más leída de ${this.category} esta semana con un título largo para probar el diseño`,
        publishDate: new Date(Date.now() - 3600000 * 24),
        views: 5432
      },
      {
        id: 102,
        title: `Segunda noticia más popular de ${this.category} con muchas lecturas`,
        publishDate: new Date(Date.now() - 3600000 * 36),
        views: 4321
      },
      {
        id: 103,
        title: `Tercera noticia más vista de ${this.category} en los últimos días`,
        publishDate: new Date(Date.now() - 3600000 * 48),
        views: 3210
      },
      {
        id: 104,
        title: `Cuarta noticia más leída de ${this.category} con gran repercusión`,
        publishDate: new Date(Date.now() - 3600000 * 72),
        views: 2987
      },
      {
        id: 105,
        title: `Quinta noticia más popular de ${this.category} entre nuestros lectores`,
        publishDate: new Date(Date.now() - 3600000 * 96),
        views: 2654
      }
    ];
  }
}
