<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 text-center mb-8">
        Weather Forecast App
      </h1>
      
      <div class="space-y-8">
        <SearchCity @coordinates-changed="onCoordinatesChanged" />
        <WeatherForecast :coordinates="selectedCoordinates" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./home.component.ts"></script>
