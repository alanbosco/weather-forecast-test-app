import { Options, Vue } from 'vue-class-component';
import SearchCity from '@/components/SearchCity.vue';
import WeatherForecast from '@/components/WeatherForecast.vue';

interface Coordinates {
  lat: number;
  lng: number;
}

@Options({
  components: {
    SearchCity,
    WeatherForecast,
  },
})
export default class HomeView extends Vue {
  selectedCoordinates: Coordinates | null = null;

  onCoordinatesChanged(coordinates: Coordinates | null) {
    this.selectedCoordinates = coordinates;
  }
}