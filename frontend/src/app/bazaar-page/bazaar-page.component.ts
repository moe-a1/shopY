import { Component, OnInit } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface BazaarCategory {
  _id: string;
  name: string;
  brandsNames: string;
  images: string[];
}

interface Bazaar {
  _id: string;
  name: string;
  partitionInfo: string;
  openDates: string;
  openTimes: string;
  location: string;
  categories: BazaarCategory[];
}

@Component({
  selector: 'app-bazaar-page',
  standalone: true,
  imports: [NavComponent, FooterComponent, HttpClientModule, CommonModule],
  templateUrl: './bazaar-page.component.html',
  styleUrl: './bazaar-page.component.css'
})
export class BazaarPageComponent implements OnInit {
  bazaarId: string | null = null;
  bazaar: Bazaar | null = null;
  isLoading = true;
  error = '';
  
  // Default category images (can be replaced with real images when available)
  categoryImages = {
    'Clothes': 'https://images.pexels.com/photos/4347654/pexels-photo-4347654.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
    'Shoes': 'https://images.pexels.com/photos/12252411/pexels-photo-12252411.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
    'Perfumes': 'https://images.pexels.com/photos/29401618/pexels-photo-29401618/free-photo-of-elegant-display-of-luxury-perfume-bottles.jpeg?auto=compress&cs=tinysrgb&w=600',
    'default': 'https://images.pexels.com/photos/1036856/pexels-photo-1036856.jpeg?auto=compress&cs=tinysrgb&w=600'
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Get the bazaar ID from the route parameters
    this.route.paramMap.subscribe(params => {
      this.bazaarId = params.get('id');
      if (this.bazaarId) {
        this.fetchBazaarDetails(this.bazaarId);
      } else {
        // If no ID provided, show example data
        this.isLoading = false;
      }
    });
  }

  fetchBazaarDetails(bazaarId: string): void {
    this.http.get<Bazaar>(`http://localhost:5000/api/bazaar/${bazaarId}`)
      .subscribe({
        next: (bazaar) => {
          this.bazaar = bazaar;
          // If no categories exist yet, fetch them separately
          if (!bazaar.categories || bazaar.categories.length === 0) {
            this.fetchBazaarCategories(bazaarId);
          } else {
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.error('Error fetching bazaar details:', err);
          this.error = 'Failed to load bazaar details. Please try again later.';
          this.isLoading = false;
        }
      });
  }

  fetchBazaarCategories(bazaarId: string): void {
    this.http.get<BazaarCategory[]>(`http://localhost:5000/api/bazaar/${bazaarId}/categories`)
      .subscribe({
        next: (categories) => {
          if (this.bazaar) {
            this.bazaar.categories = categories;
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching bazaar categories:', err);
          this.isLoading = false;
        }
      });
  }

  getCategoryImage(categoryName: string): string {
    return this.categoryImages[categoryName as keyof typeof this.categoryImages] || this.categoryImages.default;
  }
}
