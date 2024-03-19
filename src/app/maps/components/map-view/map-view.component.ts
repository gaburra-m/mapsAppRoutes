import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MapService, PlacesService } from '../../services';
import { Map, Popup, Marker } from 'mapbox-gl';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css'],
})
export class MapViewComponent implements AfterViewInit {
  @ViewChild('mapDiv')
  mapDivElement!: ElementRef;

  constructor(
    private _placesService: PlacesService,
    private _mapService: MapService
  ) {}

  ngAfterViewInit(): void {
    if (!this._placesService.userLoaction)
      throw Error('No hay placesService.userLocation');

    const map = new Map({
      container: this.mapDivElement.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/light-v11', // style URL
      center: this._placesService.userLoaction, // starting position [lng, lat]
      zoom: 14, // starting zoom
    });

    const popup = new Popup().setHTML(`
    <h6>Aquí estoy</h6>
    <span>Estoy en este lugar del mundo</span>
    `);

    new Marker({ color: 'red' })
      .setLngLat(this._placesService.userLoaction)
      .setPopup(popup)
      .addTo(map);

    this._mapService.setMap(map);
  }
}
