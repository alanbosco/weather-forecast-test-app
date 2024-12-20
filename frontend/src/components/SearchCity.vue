<template>
  <div class="max-w-4xl mx-auto p-4">
    <h3 class="text-xl font-semibold text-gray-800 mb-4">Type a city name to search</h3>
    
    <div class="relative">
      <GMapAutocomplete 
        @place_changed="placeChanged" 
        class="w-full max-w-md px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Enter a location"
      />
    </div>

    <div v-if="selectedLocationName" class="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg">
      <p class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {{ selectedLocationName }}
      </p>
    </div>

    <div class="mt-6 text-gray-600 flex items-center">
      <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      You can also click a location on the map
    </div>
    
    <div class="mt-4 rounded-lg overflow-hidden shadow-lg">
      <GMapMap
        v-if="selectedPlace"
        class="w-full h-[400px]"
        :center="selectedPlace"
        :zoom="7"
        map-type-id="roadmap"
        @click="onMapClick"
      >
        <GMapMarker
          v-if="selectedPlace"
          :position="selectedPlace"
        />
      </GMapMap>
    </div>
  </div>
</template>

<script lang="ts" src="./search-city.component.ts"></script>

<style scoped>
.search-city {
  margin-bottom: 2rem;
}

.gmap-autocomplete {
  width: 100%;
  max-width: 400px;
  padding: 8px;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.map-instruction {
  margin: 1rem 0;
  color: #666;
}

.gmap-class {
  width: 100%;
  height: 400px;
  margin-top: 1rem;
  border-radius: 8px;
  overflow: hidden;
}
</style>
