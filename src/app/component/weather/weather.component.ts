import { Component } from '@angular/core';

@Component({
  selector: 'app-weather',
  imports: [],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss'
})
export class WeatherComponent {

  location = 'Madrid';
  temperature = 24;
  condition = 'Soleado';
  
}
