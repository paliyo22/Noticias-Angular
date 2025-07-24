import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LocationData } from '../schema/location';
import { catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private apiUrl = 'https://server-news-project.onrender.com';
  private http = inject(HttpClient);

  locationState = signal({
    data: null as LocationData | null,
    loading: false,
    error: null as string | null
  });

  getLocation(): void { 
  
      this.locationState.update((state) => ({
        ...state,
        loading: true,
        error: null
      }));
  
      this.http.get<{ location: LocationData }>(`${this.apiUrl}/location`,
      ).pipe(
        tap({
          next: (response) => {
            this.locationState.update(() => ({
              data: response.location,
              loading: false,
              error: null
            }));
          }
        }),
        catchError((error) => {
          this.locationState.update((state) => ({
            ...state,
            loading: false,
            error: error.error?.error || 'Error al buscar ubicacion'
          }));
          return of(null);
        })
      ).subscribe();
  }

}
