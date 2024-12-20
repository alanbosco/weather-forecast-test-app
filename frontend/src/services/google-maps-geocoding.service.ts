export interface Coordinates {
  lat: number;
  lng: number;
}

export default class GoogleMapsGeocodingService {
  private geocoder: google.maps.Geocoder;

  constructor() {
    this.geocoder = new google.maps.Geocoder();
  }

  async getLocationName(coordinates: Coordinates): Promise<string> {
    try {
      const response = await this.geocoder.geocode({
        location: { 
          lat: coordinates.lat, 
          lng: coordinates.lng 
        }
      });

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        return result.formatted_address;
      }
      
      return `${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`;
    } catch (error) {
      console.error('Geocoding failed:', error);
      return `${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`;
    }
  }
}