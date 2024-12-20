<template>
  <div class="min-h-screen bg-gray-50">
    <div>      
      <div >
        <SearchCity @coordinates-changed="onCoordinatesChanged" />
        <WeatherForecast :coordinates="selectedCoordinates" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./home.component.ts"></script>
