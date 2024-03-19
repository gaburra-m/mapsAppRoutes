import { Injectable } from '@angular/core';
import { Feature, PlacesResponse } from '../interfaces/places';
import { PlacesApiClient } from '../api';
import { MapService } from '.';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  public userLoaction?: [number, number];
  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];

  get isUserLocationReady(): boolean {
    return !!this.userLoaction;
  }

  constructor(
    private _placesApi: PlacesApiClient,
    private _mapService: MapService
  ) {
    this.getUserLoacation();
  }

  public async getUserLoacation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.userLoaction = [coords.longitude, coords.latitude];
          resolve(this.userLoaction);
        },
        (err) => {
          alert('No se pudo obtener la geolocalización');
          console.log(err);
          reject();
        }
      );
    });
  }

  getPlacesByQuery(query: string = '') {
    if (query.length === 0) {
      this.places = [];
      this.isLoadingPlaces = false;
      return;
    }

    if (!this.userLoaction) throw Error('No hay userLocation');

    this.isLoadingPlaces = true;

    this._placesApi
      .get<PlacesResponse>(`/${query}.json`, {
        params: {
          proximity: this.userLoaction.join(','),
        },
      })
      .subscribe((resp) => {
        this.isLoadingPlaces = false;
        this.places = resp.features;

        this._mapService.createMarkersFromPlaces(
          this.places,
          this.userLoaction!
        );
      });
  }

  deletePlaces() {
    this.places = [];
  }
}
