import { Component, OnInit } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Bazaar {
  _id: string;
  name: string;
  partitionInfo: string;
  openDates: string;
  openTimes: string;
  location: string;
  imageUrl?: string; // For image mapping
}

@Component({
  selector: 'app-bazaar',
  standalone: true,
  imports: [NavComponent, FooterComponent, RouterModule, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './bazaar.component.html',
  styleUrl: './bazaar.component.css'
})
export class BazaarComponent implements OnInit {
  bazaars: Bazaar[] = [];
  allBazaars: Bazaar[] = []; // Store all bazaars for filtering
  isLoading = true;
  error = '';
  
  // Location filter properties
  locations: string[] = [];
  selectedLocation: string = '';

  // Images mapping for bazaars (temporary solution until we have images in the DB)
  private imageMapping: { [key: string]: string } = {
    'Americana Plaza': 'images/Americana.jpeg',
    '6th of October Club Bazaar': 'images/Shopping.png', 
    'Ezz El-Din Faisal Bazaar': 'images/Ezz.png',
    // Add default image for any other bazaars
    'default': 'images/bazar.jpg'
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchBazaars();
  }

  fetchBazaars(): void {
    this.http.get<{bazaars: Bazaar[], currentPage: number, totalPages: number}>('http://localhost:5000/api/bazaar')
      .subscribe({
        next: (response) => {
          this.allBazaars = response.bazaars;
          this.bazaars = response.bazaars;
          
          // Add image URLs based on bazaar name mapping
          this.bazaars.forEach(bazaar => {
            bazaar.imageUrl = this.imageMapping[bazaar.name] || this.imageMapping['default'];
          });
          
          // Extract unique locations for filter dropdown
          this.extractLocations();
          
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching bazaars:', err);
          this.error = 'Failed to load bazaars. Please try again later.';
          this.isLoading = false;
        }
      });
  }
  
  // Extract unique locations from bazaars
  extractLocations(): void {
    const locationSet = new Set<string>();
    
    this.allBazaars.forEach(bazaar => {
      // Use the actual location from the database
      if (bazaar.location) {
        // Extract just the location name, not the full URL
        const locationName = this.extractLocationNameFromUrl(bazaar.location);
        locationSet.add(locationName);
      }
    });
    
    this.locations = Array.from(locationSet);
  }
  
  // Helper function to extract a readable location name from a Google Maps URL or other location string
  extractLocationNameFromUrl(locationUrl: string): string {
    // If it's not a URL, return as is
    if (!locationUrl.includes('http')) {
      return locationUrl;
    }
    
    try {
      // For Google Maps URLs, try to extract the location name
      if (locationUrl.includes('maps')) {
        // Example patterns in Google Maps URLs:
        // .../place/PlaceName/... or .../place/PlaceName+...
        const placeMatch = locationUrl.match(/place\/([^\/+]+)/i);
        if (placeMatch && placeMatch[1]) {
          // Decode URL encoded characters and clean up
          return decodeURIComponent(placeMatch[1])
            .replace(/\+/g, ' ')
            .replace(/%20/g, ' ')
            .replace(/\s{2,}/g, ' ');
        }
        
        // If we can't extract a proper name, try to use coordinates or a generic name
        if (locationUrl.includes('q=')) {
          // It's a coordinates link, make a friendly name
          return "Map Location";
        }
      }
      
      // Fallback if we can't parse it
      return "Map Location";
    } catch (e) {
      console.error("Error parsing location URL:", e);
      return "Unknown Location";
    }
  }
  
  // Apply location filter
  applyLocationFilter(): void {
    if (!this.selectedLocation) {
      // If no location selected, show all bazaars
      this.bazaars = this.allBazaars;
    } else {
      // Filter bazaars by selected location
      this.bazaars = this.allBazaars.filter(bazaar => {
        const locationName = this.extractLocationNameFromUrl(bazaar.location);
        return locationName === this.selectedLocation;
      });
    }
    
    // Re-add image URLs for filtered bazaars
    this.bazaars.forEach(bazaar => {
      bazaar.imageUrl = this.imageMapping[bazaar.name] || this.imageMapping['default'];
    });
  }

  openLocation(event: Event, location: string, bazaarName?: string) {
    event.preventDefault();
    event.stopPropagation(); // Stop event propagation to prevent parent anchor click
    
    const locations: {[key: string]: string} = {
      'Americana': 'https://www.google.com/maps/place/%D8%A3%D9%85%D8%B1%D9%8A%D9%83%D8%A7%D9%86%D8%A7+%D8%A8%D9%84%D8%A7%D8%B2%D8%A7+-+%D8%B2%D8%A7%D9%8A%D8%AF%E2%80%AD/@30.0269193,31.0150556,17z/data=!4m14!1m7!3m6!1s0x14585a6a5fac05e3:0x2d871f3c2b02f918!2z2KPZhdix2YrZg9in2YbYpyDYqNmE2KfYstinIC0g2LLYp9mK2K8!8m2!3d30.0275138!4d31.0132317!16s%2Fg%2F11gbgcp7_3!3m5!1s0x14585a6a5fac05e3:0x2d871f3c2b02f918!8m2!3d30.0275138!4d31.0132317!16s%2Fg%2F11gbgcp7_3?entry=ttu&g_ep=EgoyMDI1MDQyMy4wIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D',
      'shopping': 'https://www.google.com/maps/place/%D8%A7%D9%84%D8%A8%D9%88%D8%A7%D8%A8%D9%87+%D8%A7%D9%84%D8%B1%D8%A6%D9%8A%D8%B3%D9%8A%D9%87%E2%80%AD/@29.9806357,30.9503253,18.86z/data=!4m14!1m7!3m6!1s0x145856fda307cdaf:0xe0963aeb7fc1b547!2z2YbYp9iv2Yog2YXYr9mK2YbYqSDZpiDYo9mD2KrZiNio2LEg2KfZhNix2YrYp9i22Yo!8m2!3d29.9809792!4d30.9506253!16s%2Fg%2F119vcnf9h!3m5!1s0x1458576b5a631043:0x7c68e6d403186a16!8m2!3d29.9808785!4d30.9508178!16s%2Fg%2F11nfm8q7mf?entry=ttu&g_ep=EgoyMDI1MDQyMy4wIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D',
      'portsaid': 'https://www.google.com/maps?q=31.265297,32.301892'
    };
    
    // First check if we have a direct location from the database
    if (location && location.startsWith('http')) {
      window.open(location, '_blank');
      return;
    }
    
    // Next check if we have a mapping for the bazaar name
    if (bazaarName) {
      // If bazaar name is "Americana Plaza Bazaar", use key "Americana"
      if (bazaarName.includes('Americana')) {
        window.open(locations['Americana'], '_blank');
        return;
      }
      // If bazaar name is "6th of October Club Bazaar", use key "shopping"
      else if (bazaarName.includes('October')) {
        window.open(locations['shopping'], '_blank');
        return;
      }
    }
    
    // Fallback to the old key-based approach
    const locationKey = location as keyof typeof locations;
    if (locations[locationKey]) {
      window.open(locations[locationKey], '_blank');
    } else {
      console.warn('Location not found for:', location);
    }
  }
}
