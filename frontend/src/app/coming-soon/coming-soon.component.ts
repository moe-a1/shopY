import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { NavComponent } from '../nav/nav.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Bazaar {
  _id: string;
  name: string;
  status: 'active' | 'coming_soon';
  partitionInfo?: string;
  openDates?: string;
  openTimes?: string;
  location: string;
  imageUrl?: string; // For mapping images
}

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [FooterComponent, NavComponent, HttpClientModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './coming-soon.component.html',
  styleUrl: './coming-soon.component.css'
})
export class ComingSoonComponent implements OnInit { 
  comingSoonBazaars: Bazaar[] = [];
  allComingSoonBazaars: Bazaar[] = []; // Store all bazaars for filtering
  isLoading = true;
  error = '';
  
  // Location filter properties
  locations: string[] = [];
  selectedLocation: string = '';

  // Images mapping for bazaars
  private imageMapping: { [key: string]: string } = {
    'October Bazaar': 'images/bazar.jpg',
    'Ataba bazaar for royal things': 'images/OIP (6) 1.png',
    'Port Said Bazaar with used stuff': 'images/OIP (8) 1.png',
    'Ceramica Cleopatra': 'images/Shopping.png',
    // Add default image for any other bazaars
    'default': 'images/bazar.jpg'
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchComingSoonBazaars();
  }

  fetchComingSoonBazaars(): void {
    // Fetch all bazaars and filter for coming_soon
    this.http.get<{bazaars: Bazaar[], currentPage: number, totalPages: number}>('http://localhost:5000/api/bazaar')
      .subscribe({
        next: (response) => {
          // Filter only coming_soon bazaars
          this.allComingSoonBazaars = response.bazaars.filter(bazaar => bazaar.status === 'coming_soon');
          this.comingSoonBazaars = this.allComingSoonBazaars;
          
          // Add image URLs based on bazaar name mapping
          this.comingSoonBazaars.forEach(bazaar => {
            bazaar.imageUrl = this.imageMapping[bazaar.name] || this.imageMapping['default'];
          });
          
          // Extract unique locations for filter dropdown
          this.extractLocations();
          
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching coming soon bazaars:', err);
          this.error = 'Failed to load bazaars. Please try again later.';
          this.isLoading = false;
        }
      });
  }
  
  // Extract unique locations from bazaars
  extractLocations(): void {
    const locationSet = new Set<string>();
    
    this.allComingSoonBazaars.forEach(bazaar => {
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
      
      // Special handling for specific locations
      if (locationUrl.toLowerCase().includes('giza')) return "Giza";
      
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
      this.comingSoonBazaars = this.allComingSoonBazaars;
    } else {
      // Filter bazaars by selected location
      this.comingSoonBazaars = this.allComingSoonBazaars.filter(bazaar => {
        const locationName = this.extractLocationNameFromUrl(bazaar.location);
        return locationName === this.selectedLocation;
      });
    }
    
    // Re-add image URLs for filtered bazaars
    this.comingSoonBazaars.forEach(bazaar => {
      bazaar.imageUrl = this.imageMapping[bazaar.name] || this.imageMapping['default'];
    });
  }

  openLocation(event: Event, location: string, bazaarName?: string) {
    event.preventDefault();
    event.stopPropagation(); // Stop event propagation to prevent parent anchor click
    
    // First check if location is a URL
    if (location && location.startsWith('http')) {
      window.open(location, '_blank');
      return;
    }
    
    // Fallback to old location handling
    const locations: {[key: string]: string} = {
      'october': 'https://www.google.com/maps/place/%D9%86%D8%A7%D8%AF%D9%8A+%D9%85%D8%AF%D9%8A%D9%86%D8%A9+%D9%A6+%D8%A3%D9%83%D8%AA%D9%88%D8%A8%D8%B1+%D8%A7%D9%84%D8%B1%D9%8A%D8%A7%D8%B6%D9%8A%E2%80%AD/@29.9811224,30.9572955,17z',
      'ataba': 'https://www.google.com/maps?q=30.053355,31.248662',
      'portsaid': 'https://www.google.com/maps?q=31.265297,32.301892',
      'Giza': 'https://www.google.com/maps/place/Giza,+El+Omraniya,+Giza+Governorate/@29.9865654,31.2283179,13z'
    };
    
    if (bazaarName) {
      if (bazaarName.includes('October')) {
        window.open(locations['october'], '_blank');
        return;
      }
      else if (bazaarName.includes('Ataba')) {
        window.open(locations['ataba'], '_blank');
        return;
      }
      else if (bazaarName.includes('Port Said')) {
        window.open(locations['portsaid'], '_blank');
        return;
      }
      else if (bazaarName.includes('Ceramica') || bazaarName.includes('Cleopatra')) {
        window.open(locations['Giza'], '_blank');
        return;
      }
    }
    
    const locationKey = location as keyof typeof locations;
    if (locations[locationKey]) {
      window.open(locations[locationKey], '_blank');
    } else {
      console.warn('Location not found for:', location);
    }
  }
}
