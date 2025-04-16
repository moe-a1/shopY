import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NavComponent } from '../../nav/nav.component';
import { FooterComponent } from '../../footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-your-products',
  standalone: true,
  imports: [NavComponent, FooterComponent, HttpClientModule, CommonModule], // Add CommonModule here
  templateUrl: './your-products.component.html',
  styleUrl: './your-products.component.css'
})
export class YourProductsComponent implements OnInit {
  products: any[] = []; // Store fetched products

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    const token = localStorage.getItem('accessToken'); // Retrieve the token from localStorage
  
    const headers = { token: `Bearer ${token}` }; // Use the correct header format
  
    this.http.get('http://localhost:5000/api/products/myproducts', { headers }).subscribe(
      (data: any) => {
        this.products = data;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  addProduct() {
    this.router.navigate(['/sell/description']);
  }
  
  deleteProduct(productId: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      const token = localStorage.getItem('accessToken');
      const headers = { token: `Bearer ${token}` };
      
      this.http.delete(`http://localhost:5000/api/products/${productId}`, { headers }).subscribe(
        (response) => {
          this.products = this.products.filter(product => product._id !== productId);
        },
        (error) => {
          console.error('Error deleting product:', error);
        }
      );
    }
  }
}