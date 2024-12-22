<template>
  <div class="relative bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto my-4">
    <div v-if="forecast || weeklyForecast" class="md:absolute md:-top-[44px] md:right-0">
      <div class="flex flex-wrap items-center justify-center md:justify-end gap-2 mb-4 md:mb-0">
        <div class="flex rounded-lg bg-gray-100 p-1">
          <button @click="toggleForecastType" data-test="toggle-daily-forecast" :class="{
            'bg-white shadow-sm text-primary-500': forecastType === ForecastTypes.daily,
            'text-gray-600 hover:text-gray-800': forecastType !== ForecastTypes.daily
          }" class="px-4 py-2 rounded-md transition-all duration-200 text-xs font-medium">
            Daily
          </button>
          <button @click="toggleForecastType" data-test="toggle-weekly-forecast" :class="{
            'bg-white shadow-sm text-primary-500': forecastType === ForecastTypes.weekly,
            'text-gray-600 hover:text-gray-800': forecastType !== ForecastTypes.weekly
          }" class="px-4 py-2 rounded-md transition-all duration-200 text-xs font-medium">
            Weekly
          </button>
        </div>
      </div>
    </div>
    <div class="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
      <h3 class="text-xl font-semibold text-gray-800">Weather forecast for selected location</h3>

      <div class="flex flex-wrap items-center gap-2">
        <div class="flex rounded-lg bg-gray-100 p-1">
          <button @click="toggleTemperatureUnit" data-test="celsius-toggle" :class="{
            'bg-white shadow-sm text-primary-500': temperatureUnit === Units.Temperature.Celsius,
            'text-gray-600 hover:text-gray-800': temperatureUnit !== Units.Temperature.Celsius
          }" class="px-4 py-2 rounded-md transition-all duration-200 text-xs font-medium">
            Celsius
          </button>
          <button @click="toggleTemperatureUnit" data-test="fahrenheit-toggle" :class="{
            'bg-white shadow-sm text-primary-500': temperatureUnit === Units.Temperature.Fahrenheit,
            'text-gray-600 hover:text-gray-800': temperatureUnit !== Units.Temperature.Fahrenheit
          }" class="px-4 py-2 rounded-md transition-all duration-200 text-xs font-medium">
            Fahrenheit
          </button>
        </div>

        <div class="flex rounded-lg bg-gray-100 p-1">
          <button @click="toggleWindSpeedUnit" data-test="mph-toggle" :class="{
            'bg-white shadow-sm text-primary-500': windSpeedUnit === Units.WindSpeed.MPH,
            'text-gray-600 hover:text-gray-800': windSpeedUnit !== Units.WindSpeed.MPH
          }" class="px-4 py-2 rounded-md transition-all duration-200 text-xs font-medium">
            MPH
          </button>
          <button @click="toggleWindSpeedUnit" data-test="kmh-toggle" :class="{
            'bg-white shadow-sm text-primary-500': windSpeedUnit === Units.WindSpeed.KMH,
            'text-gray-600 hover:text-gray-800': windSpeedUnit !== Units.WindSpeed.KMH
          }" class="px-2 md:px-4 py-2 rounded-md transition-all duration-200 text-xs font-medium">
            Km/h
          </button>
        </div>

        <button v-if="forecast && forecastType === ForecastTypes.daily" @click="refreshForecase" data-test="refresh-forecast"
          class="inline-flex items-center px-4 py-2 rounded-md bg-primary-500 text-white text-sm font-medium hover:bg-primary-400 transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 md:mr-2" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>  
          <span class="hidden md:inline">Refresh</span>
        </button>
      </div>
    </div>

    <div v-if="loading" class="bg-blue-50 text-blue-600 p-4 rounded-md animate-pulse">
      <p class="flex items-center">
        <svg class="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
        Loading weather data...
      </p>
    </div>

    <div v-else-if="error" class="bg-red-50 text-red-600 p-4 rounded-md">
      <p class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ error }}
      </p>
    </div>

    <div v-else-if="forecast && forecastType === ForecastTypes.daily" data-test="weather-forecast">
      <div class="grid grid-cols-2 md:grid-cols-12 gap-4 text-center">
        <div class="bg-blue-50 p-4 rounded-lg md:col-span-2" data-test="temperature">
          <div class="text-sm text-blue-600 font-medium tracking-tight">Temperature</div>
          <div class="text-2xl font-bold text-blue-800 mt-2">{{ forecast.current_weather.temperature }}</div>
        </div>

        <div class="bg-green-50 p-4 rounded-lg md:col-span-3" data-test="wind-speed">
          <div class="text-sm text-green-600 font-medium tracking-tight">Wind Speed</div>
          <div class="text-2xl font-bold text-green-800 mt-2">{{ forecast.current_weather.windspeed }}</div>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg col-span-2 md:col-span-2" data-test="wind-direction">
          <div class="text-sm text-gray-600 font-medium tracking-tight">Wind Direction</div>
          <div class="text-xl font-semibold text-gray-800 mt-2">{{ forecast.current_weather.winddirection }}</div>
        </div>

        <div class="bg-purple-50 p-4 rounded-lg col-span-2 md:col-span-5" data-test="weather-condition">
          <div class="text-sm text-purple-600 font-medium tracking-tight">Weather Condition</div>
          <div class="flex items-center justify-center">
            <img :src="getWeatherInfo(forecast.current_weather.weathercode).image"
              :alt="getWeatherInfo(forecast.current_weather.weathercode).description" class="w-12 h-12 mr-3" />
            <div class="text-xl font-semibold text-purple-800">
              {{ getWeatherInfo(forecast.current_weather.weathercode).description }}
            </div>
          </div>
        </div>
      </div>

      <div class="text-sm text-gray-500 mt-4">
        Last Updated: {{ new Date(forecast.current_weather.time).toLocaleString() }}
      </div>
    </div>

    <div v-else-if="weeklyForecast && forecastType === ForecastTypes.weekly" data-test="weekly-weather-forecast" class="mt-4">
      <div class="grid grid-cols-1 md:grid-cols-7 gap-4">
        <div v-for="(_, index) in weeklyForecast.daily.time" :key="weeklyForecast.daily.time[index]"
          class="flex flex-col bg-gray-50 rounded-lg shadow p-4 text-center">
          <div class="text-sm font-medium text-gray-600 mb-2">
            {{ formatDate(weeklyForecast.daily.time[index]) }}
          </div>
          
          <div class="flex items-center justify-center mb-3 mt-auto">
            <img 
              :src="getWeatherInfo(weeklyForecast.daily.weather_code[index]).image"
              :alt="getWeatherInfo(weeklyForecast.daily.weather_code[index]).description"
              class="w-10 h-10"
            />
          </div>

          <div class="flex flex-row md:flex-col justify-center gap-6 md:gap-0">
            <div>
              <div class="text-xs text-gray-500">Temperature</div>
              <div class="flex justify-center gap-2 text-sm">
                <span class="text-red-500">{{ weeklyForecast.daily.temperature_2m_max[index] }}</span>
                <span class="text-blue-500">{{ weeklyForecast.daily.temperature_2m_min[index] }}</span>
              </div>
            </div>

            <div>
              <div class="text-xs text-gray-500 md:mt-2">Wind</div>
              <div class="flex flex-row md:flex-col gap-2 md:gap-0 items-center">
                <div class="text-sm">
                  {{ weeklyForecast.daily.wind_speed_10m_max[index] }}
                </div>
                <div class="text-xs text-gray-400">
                  {{ weeklyForecast.daily.wind_direction_10m_dominant[index] }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="bg-gray-50 text-gray-600 p-4 rounded-md text-center">
      <svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Select a location to view weather forecast
    </div>
  </div>
</template>

<script lang="ts" src="./weather-forecast.component.ts"></script>