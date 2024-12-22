import WeatherService from '@/services/weather-service.service';
import { Options, Vue } from 'vue-class-component';
import { Inject, Prop, Watch } from 'vue-property-decorator';
import { ForecastModel, TemperatureUnit, WindSpeedUnit, ForcastPayload, WeeklyForecastModel } from '@/services/weather-service.service';
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

interface WeeklyForecastViewModel extends Omit<WeeklyForecastModel, 'daily'> {
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: string[];
    temperature_2m_min: string[];
    wind_speed_10m_max: string[];
    wind_direction_10m_dominant: string[];
  };
}

interface WeatherDescription {
  description: string;
  image: string;
}

@Options({
  name: 'WeatherForecast',
  components: {
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

  get ForecastTypes() {
    return {
      daily: 'daily',
      weekly: 'weekly'
    };
  }
  
  forecast: ForecastViewModel | null = null;
  weeklyForecast: WeeklyForecastViewModel | null = null;
  loading = false;
  error: string | null = null;

  temperatureUnit = this.Units.Temperature.Celsius;
  windSpeedUnit = this.Units.WindSpeed.KMH;

  forecastType = this.ForecastTypes.daily;

  getWeatherInfo(code: number, isDay = true): WeatherDescription {
    const weatherCode = weatherDescriptions[code as unknown as keyof typeof weatherDescriptions];
    if (!weatherCode) {
      return {
        description: `Unknown (${code})`,
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
        temperature: `${forecast.current_weather.temperature}${forecast.current_weather_units.temperature}`,
        windspeed: `${forecast.current_weather.windspeed}${forecast.current_weather_units.windspeed}`,
        winddirection: `${forecast.current_weather.winddirection}${forecast.current_weather_units.winddirection}`,
      }
    };
  }

  transformedWeeklyResponse(forecast: WeeklyForecastModel): WeeklyForecastViewModel {
    return {
      ...forecast,
      daily: {
        ...forecast.daily,
        temperature_2m_max: forecast.daily.temperature_2m_max.map(temp => 
          `${temp}${forecast.daily_units.temperature_2m_max}`),
        temperature_2m_min: forecast.daily.temperature_2m_min.map(temp => 
          `${temp}${forecast.daily_units.temperature_2m_min}`),
        wind_speed_10m_max: forecast.daily.wind_speed_10m_max.map(speed => 
          `${speed}${forecast.daily_units.wind_speed_10m_max}`),
        wind_direction_10m_dominant: forecast.daily.wind_direction_10m_dominant.map(dir => 
          `${dir}${forecast.daily_units.wind_direction_10m_dominant}`)
      }
    };
  }

  @Watch('coordinates', { immediate: true })
  async onCoordinatesChange(newCoords: { lat: number; lng: number } | null) {
    if (!newCoords) {
      this.forecast = null;
      this.weeklyForecast = null;
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
      if (this.forecastType === this.ForecastTypes.daily) {
        const response = await this.weatherService.getWeatherForecast(params);
        this.forecast = this.transformedResponse(response);
        this.weeklyForecast = null;
      } else {
        const response = await this.weatherService.getWeeklyWeatherForecast(params);
        this.weeklyForecast = this.transformedWeeklyResponse(response);
        this.forecast = null;
      }
    } catch (err: any) {
      this.error = err.errorI18NMessage || 'Failed to fetch weather data';
      this.forecast = null;
      this.weeklyForecast = null;
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
      this.windSpeedUnit = this.Units.WindSpeed.KMH;
    } else {
      this.windSpeedUnit = this.Units.WindSpeed.MPH;
    }

    this.refreshForecase();
  }

  toggleForecastType() {
    if (this.forecastType === this.ForecastTypes.daily) {
      this.forecastType = this.ForecastTypes.weekly;
    } else {
      this.forecastType = this.ForecastTypes.daily;
    }
    this.refreshForecase();
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }
}
