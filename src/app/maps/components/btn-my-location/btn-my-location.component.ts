import { Component } from '@angular/core';
import { MapService, PlacesService } from '../../services';

@Component({
  selector: 'app-btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styleUrls: ['./btn-my-location.component.css'],
})
export class BtnMyLocationComponent {
  constructor(
    private _placesService: PlacesService,
    private _mapService: MapService
  ) {}

  goToMyLocation() {
    if (!this._placesService.isUserLocationReady)
      throw Error('No hay ubicación de usuario');
    if (!this._mapService.isMapReady) throw Error('No hay mapa disponible');

    this._mapService.flyTo(this._placesService.userLoaction!);
  }
}
