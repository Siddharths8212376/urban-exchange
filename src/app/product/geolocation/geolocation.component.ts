import { Component, Input, OnInit } from '@angular/core';
declare const L: any;

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.scss']
})
export class GeolocationComponent implements OnInit {
  @Input() coordinates: any = [];
  map: any;
  myAPIKey = "9c053c393da34cbfb67a39442641c63a";
  generalBaseUrl = 'https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}'

  ngOnInit(): void {
    // Uncomment this to get latitude and longitude of the user at the present location
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition((position) => {
    //     console.log("Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude);
    //   });
    // }
    if(this.coordinates.length > 0) {
      this.initializeMap();
    }
  }

  initializeMap() {
    // let lat = 12.9248419;
    // let lon = 74.8577864;
    let lat = this.coordinates[1];
    let lon = this.coordinates[0];
    const map = L.map('my-map').setView([lat, lon], 15);

    // Retina displays require different mat tiles quality (Specifically for Apple devices)
    const isRetina = L.Browser.retina;

    // These APIs have a daily limit of 3000 credits/day
    //This general map API takes 1 credit per api call
    const baseUrl = `${this.generalBaseUrl}.png?apiKey=${this.myAPIKey}`;
    const retinaUrl = `${this.generalBaseUrl}@2x.png?apiKey=${this.myAPIKey}`;

    // Add map tiles layer. Set 20 as the maximal zoom and provide map data attribution.
    L.tileLayer(isRetina ? retinaUrl : baseUrl, {
      attribution: 'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | © OpenStreetMap <a href="https://www.openstreetmap.org/copyright" target="_blank">contributors</a>',
      apiKey: this.myAPIKey,
      maxZoom: 20,
      id: 'osm-bright',
    }).addTo(map);

    let marker = L.marker([lat, lon]).addTo(map);
  }

}
