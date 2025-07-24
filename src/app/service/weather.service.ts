import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WeatherData } from '../schema/weather';
import { catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private http = inject(HttpClient);
  private apiUrl = 'https://server-news-project.onrender.com';

  weatherState = signal({
    data: null as WeatherData | null,
    loading: false,
    error: null as string | null
  });  

  loadApiWeather(latitude: number, longitude: number): void {

    this.weatherState.update(state => ({
      ...state,
      loading: true,
      error: null
    }));
    
    this.http.get<{ weather: WeatherData }>(`${this.apiUrl}/location/weather`,
      {
        params: {
          latitude,
          longitude,
          lang: 'ES'
        }
      }
    ).pipe(
      tap({
        next: (result) => {
          this.weatherState.update(() => ({
            data: result.weather,
            loading: false,
            error: null
          }));
        }
      }),
      catchError((error) => {
        this.weatherState.update((state) => ({
              ...state,
              loading: false,
              error: error.error?.error || 'Error al conectar con la api'
          }));
        return of(null);
      })
    ).subscribe()
  }
}

