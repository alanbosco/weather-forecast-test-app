export interface ForecastModel {
    latitude: number;
    longitude: number;
    elevation: number;
    current_weather: {
        temperature: number;
        windspeed: number;
        winddirection: number;
        weathercode: number;
        time: Date;
    }
}