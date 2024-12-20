import WeatherService from '@/services/weather-service.service';
import { Options, Vue } from 'vue-class-component';
import { Inject, Prop, Watch } from 'vue-property-decorator';
import { ForecastModel } from '@/services/weather-service.service';

@Options({
  props: {
    coordinates: {
      type: Object as () => { lat: number; lng: number } | null,
      required: true
    }
  }
})
export default class WeatherForecast extends Vue {
  @Inject('weatherService')
  public weatherService!: WeatherService;

  @Prop() coordinates!: { lat: number; lng: number } | null;
  
  forecast: ForecastModel | null = null;
  loading = false;
  error: string | null = null;

  @Watch('coordinates', { immediate: true })
  async onCoordinatesChange(newCoords: { lat: number; lng: number } | null) {
    if (!newCoords) {
      this.forecast = null;
      this.error = null;
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      this.forecast = await this.weatherService.getWeatherForecast(newCoords.lat, newCoords.lng);
    } catch (err: any) {
      this.error = err.errorI18NMessage || 'Failed to fetch weather data';
      this.forecast = null;
    } finally {
      this.loading = false;
    }
  }

  getWeatherDescription(code: number): string {
    // WMO Weather interpretation codes (WW)
    const weatherCodes: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow fall',
      73: 'Moderate snow fall',
      75: 'Heavy snow fall',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    };
    
    return weatherCodes[code] || `Unknown (${code})`;
  }
}
