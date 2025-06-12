import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-news',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent implements OnInit{

  newsId: number =1;
  news: any;
  comments: any[] = [];
  relatedNews: any[] = [];
  newComment = {
    name: '',
    email: '',
    content: ''
  };

  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.newsId = +params['id'];
      this.loadNewsDetails();
      this.loadComments();
      this.loadRelatedNews();
    });
  }

  loadNewsDetails(): void {
    // En un caso real, aquí harías una llamada a un servicio para obtener los detalles de la noticia
    // Por ahora, usamos datos de ejemplo
    this.news = {
      id: this.newsId,
      title: 'Acuerdo histórico alcanzado en la cumbre internacional sobre cambio climático',
      category: 'Política',
      publishDate: new Date('2025-05-10T14:30:00'),
      imageUrl: 'assets/images/news-detail.jpg',
      imageCaption: 'Líderes mundiales durante la firma del acuerdo climático en Ginebra',
      author: 'María González',
      authorRole: 'Corresponsal Internacional',
      authorAvatar: 'assets/images/author-avatar.jpg',
      summary: 'Los líderes mundiales han llegado a un consenso sin precedentes para reducir las emisiones de carbono en un 50% para 2030, en lo que se considera el acuerdo más ambicioso hasta la fecha para combatir el cambio climático.',
      content: `
        <p>Tras dos semanas de intensas negociaciones, los representantes de 195 países han firmado un acuerdo histórico que establece objetivos vinculantes para la reducción de emisiones de gases de efecto invernadero. El pacto, denominado "Acuerdo de Ginebra", marca un antes y un después en la lucha contra el cambio climático.</p>

        <p>El documento establece que las naciones desarrolladas deberán reducir sus emisiones en un 50% para 2030 y alcanzar la neutralidad de carbono para 2045. Los países en desarrollo tendrán plazos más flexibles, pero igualmente ambiciosos, con una reducción del 30% para 2030 y neutralidad de carbono para 2050.</p>

        <h2>Financiación sin precedentes</h2>

        <p>Uno de los puntos más destacados del acuerdo es la creación de un fondo climático de 100.000 millones de dólares anuales, que será financiado principalmente por las naciones industrializadas. Este fondo estará destinado a ayudar a los países en desarrollo a implementar tecnologías limpias y adaptarse a los efectos del cambio climático.</p>

        <blockquote>
          "Este es el momento decisivo que nuestro planeta ha estado esperando. Por primera vez, tenemos un compromiso real y vinculante que aborda la magnitud de la crisis climática", declaró Antonio Guterres, Secretario General de las Naciones Unidas.
        </blockquote>

        <h2>Mecanismos de verificación</h2>

        <p>El acuerdo incluye también mecanismos de verificación robustos, con revisiones bianuales del progreso de cada país y sanciones económicas para aquellos que no cumplan con sus compromisos. Un comité internacional independiente será el encargado de supervisar la implementación del acuerdo.</p>

        <p>Los expertos coinciden en que, de cumplirse los objetivos establecidos, el aumento de la temperatura global podría limitarse a 1.5°C por encima de los niveles preindustriales, evitando así los peores efectos del cambio climático.</p>

        <h3>Reacciones encontradas</h3>

        <p>Mientras que organizaciones ambientalistas han celebrado el acuerdo como un paso histórico, algunos sectores industriales han expresado preocupación por el impacto económico que podría tener la rápida transición hacia energías limpias.</p>

        <p>Sin embargo, un reciente estudio del Banco Mundial sugiere que la transición energética podría crear más de 24 millones de nuevos empleos a nivel global para 2030, compensando con creces las pérdidas en sectores tradicionales.</p>

        <p>El próximo paso será la ratificación del acuerdo por parte de los parlamentos nacionales, proceso que se espera esté completado antes de finales de año.</p>
      `,
      tags: ['Cambio Climático', 'Acuerdo Internacional', 'Medio Ambiente', 'Emisiones']
    };

    // Actualizar título y metadatos para SEO
    this.titleService.setTitle(this.news.title + ' | NoticiasDiarias');
    this.metaService.updateTag({ name: 'description', content: this.news.summary });
  }

  loadComments(): void {
    // En un caso real, aquí harías una llamada a un servicio para obtener los comentarios
    this.comments = [
      {
        id: 1,
        name: 'Carlos Rodríguez',
        avatar: 'assets/images/avatar1.jpg',
        date: new Date('2025-05-11T10:15:00'),
        content: 'Me parece un gran avance, pero me preocupa que los plazos sean demasiado ambiciosos. ¿Realmente podrán los países cumplir con estos objetivos?',
        replies: [
          {
            id: 2,
            name: 'Ana Martínez',
            avatar: 'assets/images/avatar2.jpg',
            date: new Date('2025-05-11T11:30:00'),
            content: 'Creo que son ambiciosos pero necesarios. La crisis climática no espera y necesitamos acciones contundentes ahora.'
          }
        ]
      },
      {
        id: 3,
        name: 'Miguel López',
        avatar: 'assets/images/avatar3.jpg',
        date: new Date('2025-05-11T14:45:00'),
        content: 'El fondo de 100.000 millones es un paso importante, pero sigue siendo insuficiente considerando la magnitud del problema. Se necesitará mucho más para una transición justa.',
        replies: []
      }
    ];
  }

  loadRelatedNews(): void {
    // En un caso real, aquí harías una llamada a un servicio para obtener noticias relacionadas
    this.relatedNews = [
      {
        id: 101,
        title: 'La industria energética se prepara para la transición verde',
        category: 'Economía',
        excerpt: 'Las principales empresas del sector energético anuncian planes de inversión en energías renovables tras el acuerdo climático.',
        imageUrl: 'assets/images/related1.jpg',
        time: 'Hace 5 horas',
        author: 'Por Carlos Rodríguez'
      },
      {
        id: 102,
        title: 'Protestas climáticas se intensifican en las principales capitales',
        category: 'Sociedad',
        excerpt: 'Activistas exigen a sus gobiernos que ratifiquen rápidamente el acuerdo de Ginebra y tomen medidas inmediatas.',
        imageUrl: 'assets/images/related2.jpg',
        time: 'Hace 8 horas',
        author: 'Por Ana Martínez'
      },
      {
        id: 103,
        title: 'Nuevas tecnologías de captura de carbono ganan impulso',
        category: 'Tecnología',
        excerpt: 'Startups dedicadas a la captura y almacenamiento de carbono reciben financiación récord tras el acuerdo climático.',
        imageUrl: 'assets/images/related3.jpg',
        time: 'Hace 12 horas',
        author: 'Por Miguel López'
      }
    ];
  }

  submitComment(): void {
    // En un caso real, aquí enviarías el comentario a un servicio
    console.log('Comentario enviado:', this.newComment);
    
    // Simulamos la adición del comentario a la lista
    const newCommentObj = {
      id: this.comments.length + 1,
      name: this.newComment.name,
      avatar: 'assets/images/default-avatar.jpg',
      date: new Date(),
      content: this.newComment.content,
      replies: []
    };
    
    this.comments.unshift(newCommentObj);
    
    // Limpiar el formulario
    this.newComment = {
      name: '',
      email: '',
      content: ''
    };
  }
}
