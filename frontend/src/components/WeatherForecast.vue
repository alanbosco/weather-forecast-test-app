<template>
  <div class="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto my-4">
    <h3 class="text-xl font-semibold text-gray-800 mb-4">Weather forecast for selected location</h3>
    
    <div v-if="loading" class="bg-blue-50 text-blue-600 p-4 rounded-md animate-pulse">
      <p class="flex items-center">
        <svg class="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading weather data...
      </p>
    </div>
    
    <div v-else-if="error" class="bg-red-50 text-red-600 p-4 rounded-md">
      <p class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ error }}
      </p>
    </div>
    
    <div v-else-if="forecast" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-blue-50 p-4 rounded-lg">
          <div class="text-sm text-blue-600 font-medium">Temperature</div>
          <div class="text-2xl font-bold text-blue-800">{{ forecast.current_weather.temperature }}°C</div>
        </div>
        
        <div class="bg-green-50 p-4 rounded-lg">
          <div class="text-sm text-green-600 font-medium">Wind Speed</div>
          <div class="text-2xl font-bold text-green-800">{{ forecast.current_weather.windspeed }} km/h</div>
        </div>
      </div>

      <div class="bg-gray-50 p-4 rounded-lg">
        <div class="text-sm text-gray-600 font-medium">Wind Direction</div>
        <div class="text-xl font-semibold text-gray-800">{{ forecast.current_weather.winddirection }}°</div>
      </div>

      <div class="bg-purple-50 p-4 rounded-lg">
        <div class="text-sm text-purple-600 font-medium">Weather Condition</div>
        <div class="flex items-center justify-center">
          <img 
            :src="getWeatherInfo(forecast.current_weather.weathercode).image" 
            :alt="getWeatherInfo(forecast.current_weather.weathercode).description"
            class="w-12 h-12 mr-3"
          />
          <div class="text-xl font-semibold text-purple-800">
            {{ getWeatherInfo(forecast.current_weather.weathercode).description }}
          </div>
        </div>
      </div>

      <div class="text-sm text-gray-500 mt-4">
        Last Updated: {{ new Date(forecast.current_weather.time).toLocaleString() }}
      </div>
    </div>
    
    <div v-else class="bg-gray-50 text-gray-600 p-4 rounded-md text-center">
      <svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Select a location to view weather forecast
    </div>
  </div>
</template>

<script lang="ts" src="./weather-forecast.component.ts"></script>

<style scoped>
.weather-forecast {
  padding: 1rem;
  border-radius: 8px;
  background: #f5f5f5;
  margin: 1rem 0;
}

.forecast-data {
  display: grid;
  gap: 0.5rem;
  padding: 1rem;
  background: white;
  border-radius: 4px;
}

.forecast-item {
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
}

.error {
  color: #dc3545;
  padding: 1rem;
  background: #ffe6e6;
  border-radius: 4px;
}

.loading {
  color: #0066cc;
  padding: 1rem;
  background: #e6f2ff;
  border-radius: 4px;
}

.no-data {
  color: #666;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 4px;
}
</style>
