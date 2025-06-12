import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-featured-news',
  imports: [RouterModule, CommonModule],
  templateUrl: './featured-news.component.html',
  styleUrl: './featured-news.component.scss'
})
export class FeaturedNewsComponent {

  mostReadNews = [
    {
      id: 8,
      title: 'La selección nacional clasifica a la final del torneo continental',
      time: 'Hace 2 horas'
    },
    {
      id: 9,
      title: 'Nueva tecnología promete revolucionar el tratamiento del cáncer',
      time: 'Hace 4 horas'
    },
    {
      id: 10,
      title: 'Crisis económica: El banco central anuncia medidas de emergencia',
      time: 'Hace 6 horas'
    },
    {
      id: 11,
      title: 'Estreno mundial bate récords de taquilla en su primer fin de semana',
      time: 'Hace 8 horas'
    }
  ];

}
