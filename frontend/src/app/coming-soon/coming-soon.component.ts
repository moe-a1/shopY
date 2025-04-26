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

interface PaginatedBazaarResponse {
  bazaars: Bazaar[];
  currentPage: number;
  totalPages: number;
  totalBazaars: number;
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
  
  // Pagination properties
  currentPage = 1;
  totalPages = 1;
  limit = 3;
  
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
    this.fetchComingSoonBazaars(this.currentPage);
  }

  fetchComingSoonBazaars(page: number): void {
    this.isLoading = true;
    // Modified the query to fetch only coming_soon bazaars directly from the API
    this.http.get<PaginatedBazaarResponse>(`http://localhost:5000/api/bazaar?page=${page}&limit=${this.limit}&status=coming_soon`)
      .subscribe({
        next: (response) => {
          // No need to filter here since we're requesting only coming_soon bazaars
          this.comingSoonBazaars = response.bazaars;
          this.allComingSoonBazaars = response.bazaars;
          
          // Set pagination data based on the response
          this.currentPage = response.currentPage;
          this.totalPages = response.totalPages;
          
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
      // If no location selected, show all coming soon bazaars
      this.fetchComingSoonBazaars(1);
    } else {
      // Get all coming soon bazaars first to apply location filter properly
      this.http.get<PaginatedBazaarResponse>('http://localhost:5000/api/bazaar?limit=1000&status=coming_soon')
        .subscribe({
          next: (response) => {
            // Filter bazaars by selected location
            const filteredBazaars = response.bazaars.filter(bazaar => {
              const locationName = this.extractLocationNameFromUrl(bazaar.location);
              return locationName === this.selectedLocation;
            });

            // Set the filtered bazaars to display
            this.comingSoonBazaars = filteredBazaars.slice(0, this.limit);
            this.allComingSoonBazaars = filteredBazaars;
            
            // Update pagination information
            this.currentPage = 1;
            this.totalPages = Math.ceil(filteredBazaars.length / this.limit);
            
            // Add image URLs based on bazaar name mapping
            this.comingSoonBazaars.forEach(bazaar => {
              bazaar.imageUrl = this.imageMapping[bazaar.name] || this.imageMapping['default'];
            });
          },
          error: (err) => {
            console.error('Error applying location filter:', err);
            this.error = 'Failed to apply filter. Please try again later.';
          }
        });
    }
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
  
  // Pagination methods
  prevPage(): void {
    if (this.currentPage > 1) {
      if (this.selectedLocation) {
        this.navigateFilteredPage(this.currentPage - 1);
      } else {
        this.fetchComingSoonBazaars(this.currentPage - 1);
      }
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      if (this.selectedLocation) {
        this.navigateFilteredPage(this.currentPage + 1);
      } else {
        this.fetchComingSoonBazaars(this.currentPage + 1);
      }
    }
  }
  
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      if (this.selectedLocation) {
        this.navigateFilteredPage(page);
      } else {
        this.fetchComingSoonBazaars(page);
      }
    }
  }
  
  getPageNumbers(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  // Navigation for filtered results
  navigateFilteredPage(pageNumber: number): void {
    if (!this.selectedLocation || pageNumber < 1 || pageNumber > this.totalPages) {
      return;
    }
    
    // Calculate the slice of bazaars to show for this page
    const startIndex = (pageNumber - 1) * this.limit;
    const endIndex = startIndex + this.limit;
    this.comingSoonBazaars = this.allComingSoonBazaars.slice(startIndex, endIndex);
    this.currentPage = pageNumber;
    
    // Add image URLs for the current page
    this.comingSoonBazaars.forEach(bazaar => {
      bazaar.imageUrl = this.imageMapping[bazaar.name] || this.imageMapping['default'];
    });
  }
}
