import { Options, Vue } from 'vue-class-component';
import GoogleMapsGeocodingService, { Coordinates } from '@/services/google-maps-geocoding.service';

@Options({
  emits: ['coordinates-changed']
})
export default class SearchCity extends Vue {
  selectedPlace: Coordinates | null = null;
  selectedLocationName = '';
  private geocodingService: GoogleMapsGeocodingService | null = null;

  placeChanged(place: any) {
    if (place.geometry?.location) {
      this.selectedPlace = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      this.selectedLocationName = place.formatted_address || '';
      this.emitCoordinates();
    }
  }

  async onMapClick(event: any) {
    if (event.latLng) {
      const coordinates = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      
      this.selectedPlace = coordinates;

      // Initialize geocoding service only when needed
      if (!this.geocodingService) {
        this.geocodingService = new GoogleMapsGeocodingService();
      }
      
      this.selectedLocationName = await this.geocodingService.getLocationName(coordinates);
      this.emitCoordinates();
    }
  }

  private emitCoordinates() {
    this.$emit('coordinates-changed', this.selectedPlace);
  }
}