import WeatherService from '@/services/weather-service.service';
import { Options, Vue } from 'vue-class-component';
import { Inject, Prop, Watch } from 'vue-property-decorator';
import { ForecastModel, TemperatureUnit, WindSpeedUnit, ForcastPayload } from '@/services/weather-service.service';
// https://gist.github.com/stellasphere/9490c195ed2b53c707087c8c2db4ec0c
import weatherDescriptions from '@/data/wmo-descriptions.json';

interface ForecastViewModel extends Omit<ForecastModel, 'current_weather'> {
  current_weather: {
    time: string;
    interval: number;
    temperature: string;
    windspeed: string;
    winddirection: string;
    is_day: number;
    weathercode: number;
  };
}

interface WeatherDescription {
  description: string;
  image: string;
}

interface WMOCode {
  day: WeatherDescription;
  night: WeatherDescription;
}

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

  get Units() {
    return {
      Temperature: TemperatureUnit,
      WindSpeed: WindSpeedUnit
    };
  }
  
  forecast: ForecastViewModel | null = null;
  loading = false;
  error: string | null = null;

  temperatureUnit = this.Units.Temperature.Celsius;
  windSpeedUnit = this.Units.WindSpeed.KPH;

  getWeatherInfo(code: number, isDay = true): WeatherDescription {
    const weatherCode = weatherDescriptions[code as unknown as keyof typeof weatherDescriptions];
    if (!weatherCode) {
      return {
        description: 'Unknown weather',
        image: 'https://openweathermap.org/img/wn/01d@2x.png'
      };
    }
    return isDay ? weatherCode.day : weatherCode.night;
  }

  transformedResponse(forecast: ForecastModel): ForecastViewModel {
    return {
      ...forecast,
      current_weather: {
        ...forecast.current_weather,
        temperature: `${forecast.current_weather.temperature} ${forecast.current_weather_units.temperature}`,
        windspeed: `${forecast.current_weather.windspeed} ${forecast.current_weather_units.windspeed}`,
        winddirection: `${forecast.current_weather.winddirection} ${forecast.current_weather_units.winddirection}`,
      }
    };
  }

  @Watch('coordinates', { immediate: true })
  async onCoordinatesChange(newCoords: { lat: number; lng: number } | null) {
    if (!newCoords) {
      this.forecast = null;
      this.error = null;
      return;
    }

    this.loading = true;
    this.error = null;

    const params: ForcastPayload = {
      lat: newCoords.lat,
      lng: newCoords.lng
    };

    if (this.temperatureUnit === this.Units.Temperature.Fahrenheit) {
      params.temperatureUnit = this.Units.Temperature.Fahrenheit;
    }

    if (this.windSpeedUnit === this.Units.WindSpeed.MPH) {
      params.windSpeedUnit = this.Units.WindSpeed.MPH;
    }

    try {
      const response = await this.weatherService.getWeatherForecast(params);

      this.forecast = this.transformedResponse(response);
    } catch (err: any) {
      this.error = err.errorI18NMessage || 'Failed to fetch weather data';
      this.forecast = null;
    } finally {
      this.loading = false;
    }
  }

  refreshForecase() {
    this.onCoordinatesChange(this.coordinates);
  }

  toggleTemperatureUnit() {
    if (this.temperatureUnit === this.Units.Temperature.Celsius) {
      this.temperatureUnit = this.Units.Temperature.Fahrenheit;
    } else {
      this.temperatureUnit = this.Units.Temperature.Celsius;
    }

    this.refreshForecase();
  }

  toggleWindSpeedUnit() {
    if (this.windSpeedUnit === this.Units.WindSpeed.MPH) {
      this.windSpeedUnit = this.Units.WindSpeed.KPH;
    } else {
      this.windSpeedUnit = this.Units.WindSpeed.MPH;
    }

    this.refreshForecase();
  }
}
