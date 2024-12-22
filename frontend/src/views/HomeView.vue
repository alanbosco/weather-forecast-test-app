<template>
  <div>
    <SearchCity @coordinates-changed="onCoordinatesChanged" />
    <WeatherForecast :coordinates="selectedCoordinates" />
  </div>
</template>

<script lang="ts" src="./home.component.ts"></script>
