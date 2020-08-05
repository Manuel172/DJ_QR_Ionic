import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
declare var mapboxgl: any;


@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit, AfterViewInit {
  latitud: number;
  longitud: number;
  constructor(private direccion: ActivatedRoute) { }

  ngOnInit() {
      let geo: any =  this.direccion.snapshot.paramMap.get('geo:');
      console.log('en pagina mapa:', geo);
      geo = geo.substr(4, 50);
      geo = geo.split(',');
      this.latitud =  Number(geo[0]);
      this.longitud = Number(geo[1]);
      console.log('Lat:', this.latitud);
      console.log('longitud: ', this.longitud);
  }

  ngAfterViewInit() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFudWVsc2FsYXNjIiwiYSI6ImNrODdtMXJzcTB0eXMzZWxrODg0ZDIzdnoifQ.RO8aM76rRLXHgBvwo5xnBw';
    const map = new mapboxgl.Map({
      container: 'map',
      // style: 'mapbox://styles/mapbox/light-v10',
      style: 'mapbox://styles/mapbox/streets-v11',
      // Longitud y Latitud
      center: [this.longitud, this.latitud],
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      antialias: true
    });

    map.addControl(new mapboxgl.NavigationControl());
    // La capa 'edificio' en la fuente del vector mapbox-streets contiene building-height
    // datos de OpenStreetMap.

    // tslint:disable-next-line: only-arrow-functions
    map.on('load', () => {
      map.resize();

      // genera puntero de la ubicacion
      new mapboxgl.Marker()
      .setLngLat([this.longitud, this.latitud])
      .addTo(map);
      // fin puntero

  // Insert the layer beneath any symbol layer.
      const layers = map.getStyle().layers;
      let labelLayerId;
        // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
          labelLayerId = layers[i].id;
          break;
        }
      }

      map.addLayer({
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 15,
        paint: {
            'fill-extrusion-color': '#aaa',
            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'height']
            ],
            'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.6
          }
        },
        labelLayerId);
        });
      }

}
