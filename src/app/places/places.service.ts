import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private htppClient = inject(HttpClient);
  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlace(
      'http://localhost:3000/places',
      'Something went wrong fetching the available place. Please try again later.'
    );
  }

  loadUserPlaces() {
     return this.fetchPlace(
      'http://localhost:3000/user-places',
      'Something went wrong fetching your favorite place. Please try again later.'
    );
  }

  addPlaceToUserPlaces(placeId: string) {
    return this.htppClient.put('http://localhost:3000/user-places', {
    placeId,
  })
  }

  removeUserPlace(place: Place) {}

  private fetchPlace(url: string, errorMessage: string) {
    return this.htppClient.get<{ places: Place[] }>(url).pipe(
      map((resData) => resData.places),
      catchError((error) => {
        console.log(error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
