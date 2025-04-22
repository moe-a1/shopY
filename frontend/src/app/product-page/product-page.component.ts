import { Component, OnInit } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string[];
  quantity: number;
  seller: {
    _id: string;
    username: string;
  };
  reviews: {
    _id: string;
    user: {
      _id: string;
      username: string;
    };
    rating: number;
    comment: string;
    createdAt: Date;
  }[];
}

interface ReviewForm {
  rating: number;
  comment: string;
}

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [NavComponent, FooterComponent, CommonModule, HttpClientModule, RouterModule, FormsModule],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css'
})
export class ProductPageComponent implements OnInit {
  product: Product | null = null;
  selectedImageIndex: number = 0;
  relatedProducts: Product[] = [];
  apiUrl = 'http://localhost:5000/api'; // adjust this to match your backend URL
  averageRating: number = 0;
  isLoggedIn: boolean = false;
  newReview: ReviewForm = {
    rating: 0,
    comment: ''
  };

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      token: `Bearer ${token}`
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      this.fetchProductDetails(productId);
      this.fetchRelatedProducts(productId);
    });
    
    // Check if user is logged in
    this.isLoggedIn = !!localStorage.getItem('accessToken');
  }

  fetchProductDetails(productId: string) {
    this.http.get<Product>(`${this.apiUrl}/products/${productId}`)
      .subscribe({
        next: (product) => {
          this.product = product;
          this.averageRating = this.calculateAverageRating();
        },
        error: (error) => {
          console.error('Error fetching product:', error);
        }
      });
  }

  fetchRelatedProducts(productId: string) {
    this.http.get<Product[]>(`${this.apiUrl}/products/${productId}/related`).subscribe({
      next: (products) => {
        this.relatedProducts = products;
      },
      error: (error) => {
        console.error('Error fetching related products:', error);
      },
    });
  }

  selectImage(index: number) {
    this.selectedImageIndex = index;
  }

  addToCart() {
    if (!this.product) return;

    const cartItem = {
      productId: this.product._id,
      quantity: 1,
    };

    const headers = this.getAuthHeaders();

    this.http.post(`${this.apiUrl}/cart/updateCart`, cartItem, { headers }).subscribe({
      next: () => {
        const notification = document.getElementById('cart-notification');
        if (notification) {
          notification.style.display = 'block';
          setTimeout(() => {
            notification.style.display = 'none';
          }, 3000); // Hide after 3 seconds
        }
      },
      error: (error) => {
        console.error('Error adding product to cart:', error);
      },
    });
  }

  calculateAverageRating() {
    if (!this.product?.reviews?.length) return 0;
    const sum = this.product.reviews.reduce((acc, review) => acc + review.rating, 0);
    return Number((sum / this.product.reviews.length).toFixed(1));
  }
  
  // New methods for review functionality
  setRating(rating: number) {
    this.newReview.rating = rating;
  }
  
  submitReview() {
    if (!this.product || !this.isLoggedIn) return;
    
    const headers = this.getAuthHeaders();
    
    this.http.post(`${this.apiUrl}/products/${this.product._id}/reviews`, this.newReview, { headers })
      .subscribe({
        next: (response) => {
          console.log('Review submitted:', response);
          
          // Refresh product details to get updated reviews
          this.fetchProductDetails(this.product!._id);
          
          // Reset the form
          this.newReview = {
            rating: 0,
            comment: ''
          };
          
          // Show notification
          const notification = document.getElementById('review-notification');
          if (notification) {
            notification.style.display = 'block';
            setTimeout(() => {
              notification.style.display = 'none';
            }, 3000);
          }
        },
        error: (error) => {
          console.error('Error submitting review:', error);
        }
      });
  }
}