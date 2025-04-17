import { Component, OnInit } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http'; 
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
}

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [NavComponent, FooterComponent, CommonModule, HttpClientModule, RouterModule],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css'
})
export class ProductPageComponent implements OnInit {
  product: Product | null = null;
  selectedImageIndex: number = 0;
  apiUrl = 'http://localhost:5000/api'; // adjust this to match your backend URL

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken'); 
    console.log(token);
    return new HttpHeaders({
      token: `Bearer ${token}` 
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      this.fetchProductDetails(productId);
    });
  }

  fetchProductDetails(productId: string) {
    this.http.get<Product>(`${this.apiUrl}/products/${productId}`)
      .subscribe({
        next: (product) => {
          this.product = product;
        },
        error: (error) => {
          console.error('Error fetching product:', error);
        }
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
        alert('Product added to cart successfully!');
      },
      error: (error) => {
        console.error('Error adding product to cart:', error);
        alert('Failed to add product to cart.');
      },
    });
  }
}
