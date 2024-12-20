import { Options, Vue } from 'vue-class-component';

interface Coordinates {
  lat: number;
  lng: number;
}

@Options({
  emits: ['coordinates-changed']
})
export default class SearchCity extends Vue {
  selectedPlace: Coordinates | null = null;
  selectedLocationName: string = '';

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

  onMapClick(event: any) {
    if (event.latLng) {
      this.selectedPlace = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      this.selectedLocationName = `${event.latLng.lat().toFixed(4)}, ${event.latLng.lng().toFixed(4)}`;
      this.emitCoordinates();
    }
  }

  private emitCoordinates() {
    this.$emit('coordinates-changed', this.selectedPlace);
  }
}