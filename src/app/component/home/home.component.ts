import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FeaturedNewsComponent } from '../featured-news/featured-news.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [ RouterModule, CommonModule, FeaturedNewsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit {

  constructor() { }
  //newsService = inject(NewsService);
 // news$: Observable<NewsOutput[]> = this.newsService.getNews();
  currentPage: number = 1;
totalPages: number = 10; // Ajusta según la cantidad de páginas que tengas

getVisiblePages(): (number | string)[] {
  const pages: (number | string)[] = [];
  const maxVisiblePages = 5;
  
  if (this.totalPages <= maxVisiblePages) {
    // Si hay pocas páginas, mostrar todas
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Lógica para mostrar "1 2 3 ... n" o "1 ... 4 5 6 ... n"
    if (this.currentPage <= 3) {
      // Mostrar: 1 2 3 4 ... n
      for (let i = 1; i <= 4; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(this.totalPages);
    } else if (this.currentPage >= this.totalPages - 2) {
      // Mostrar: 1 ... n-3 n-2 n-1 n
      pages.push(1);
      pages.push('...');
      for (let i = this.totalPages - 3; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Mostrar: 1 ... current-1 current current+1 ... n
      pages.push(1);
      pages.push('...');
      for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(this.totalPages);
    }
  }
  
  return pages;
}

goToPage(page: number | string): void {
  if (typeof page === 'number' && page !== this.currentPage) {
    this.currentPage = page;
    // Aquí cargarías las noticias de la página seleccionada
    this.loadNews();
  }
}

goToPreviousPage(): void {
  if (this.currentPage > 1) {
    this.goToPage(this.currentPage - 1);
  }
}

goToNextPage(): void {
  if (this.currentPage < this.totalPages) {
    this.goToPage(this.currentPage + 1);
  }
}

loadNews(): void {
  // Lógica para cargar las noticias según la página actual
}
  ngOnInit(): void {
    // Inicialización del componente
  }

  mainStory = {
    id: 1,
    title: 'Acuerdo histórico alcanzado en la cumbre internacional sobre cambio climático',
    excerpt: 'Los líderes mundiales han llegado a un consenso sin precedentes para reducir las emisiones de carbono en un 50% para 2030.',
    imageUrl: 'assets/images/main-news.jpg',
    time: 'Hace 2 horas',
    author: 'Por María González'
  };

  newsList = [
    {
      id: 2,
      title: 'Nuevas medidas fiscales anunciadas por el gobierno',
      category: 'Política',
      excerpt: 'El gobierno ha presentado un paquete de medidas fiscales destinadas a reactivar la economía y apoyar a las pequeñas empresas afectadas por la crisis.',
      imageUrl: 'assets/images/news1.jpg',
      time: 'Hace 1 hora',
      author: 'Por Carlos Rodríguez'
    },
    {
      id: 3,
      title: 'La bolsa registra su mejor semana en los últimos dos años',
      category: 'Economía',
      excerpt: 'Los mercados financieros han respondido positivamente a los nuevos datos económicos, registrando ganancias significativas en todos los sectores.',
      imageUrl: 'assets/images/news2.jpg',
      time: 'Hace 2 horas',
      author: 'Por Ana Martínez'
    },
    {
      id: 4,
      title: 'El equipo local consigue una victoria histórica en el campeonato',
      category: 'Deportes',
      excerpt: 'En un partido lleno de emoción, el equipo local logró imponerse con un marcador ajustado que los coloca en la cima de la clasificación.',
      imageUrl: 'assets/images/news3.jpg',
      time: 'Hace 3 horas',
      author: 'Por Carlos Rodríguez'
    },
    {
      id: 5,
      title: 'La inteligencia artificial transforma el sector de la salud',
      category: 'Tecnología',
      excerpt: 'Nuevos avances en inteligencia artificial están revolucionando el diagnóstico médico, permitiendo detectar enfermedades en etapas más tempranas.',
      imageUrl: 'assets/images/news4.jpg',
      time: 'Hace 4 horas',
      author: 'Por Ana Martínez'
    },
    {
      id: 6,
      title: 'Festival internacional de cine anuncia su programación',
      category: 'Cultura',
      excerpt: 'La edición de este año contará con más de 200 películas de 50 países, incluyendo varios estrenos mundiales de directores reconocidos.',
      imageUrl: 'assets/images/news5.jpg',
      time: 'Hace 5 horas',
      author: 'Por Carlos Rodríguez'
    },
    {
      id: 7,
      title: 'Tensiones diplomáticas entre países vecinos aumentan',
      category: 'Política',
      excerpt: 'Las relaciones diplomáticas se han deteriorado tras una serie de declaraciones controvertidas por parte de ambos gobiernos.',
      imageUrl: 'assets/images/news6.jpg',
      time: 'Hace 6 horas',
      author: 'Por Ana Martínez'
    }
  ];

  
 
}