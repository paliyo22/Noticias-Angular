import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit } from '@angular/core';
import { WeatherService } from '../../service/weather.service';
import { LocationService } from '../../service/location.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather',
  imports: [CommonModule],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherComponent implements OnInit{

  weatherService = inject(WeatherService);
  private locationService = inject(LocationService);
  
  location = computed(() => this.locationService.locationState().data);

  loadWeather = effect(() => {
    if (this.location()) {
      this.weatherService.loadApiWeather(this.location()!.location.latitude, this.location()!.location.longitude);
    }
  });
  

  ngOnInit(): void {
    this.locationService.getLocation();
  }
  
  reload(){
    if(!this.location()){
      this.locationService.getLocation();
      return;
    }
    this.weatherService.loadApiWeather(this.location()!.location.latitude, this.location()!.location.longitude);
  }
}
