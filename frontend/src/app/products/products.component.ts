import { Component, OnInit } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs/operators';

interface PaginatedProductsResponse {
  products: any[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
}

@Component({
  selector: 'app-products',
  imports: [NavComponent, FooterComponent, CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: any[] = []; // Array to store products
  minPrice: number = 0; // Minimum price for filtering
  maxPrice: number = 0; // Maximum price for filtering
  currentPriceRange: number = 0; // Current price range for filtering
  sortOptions: string[] = ['Most Popular', 'Price: Low to High', 'Price: High to Low', 'Newest First'];
  selectedSort: string = 'Most Popular';
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 6;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.fetchProducts(this.currentPage);
    this.fetchPriceRange();
  }

  // Fetch all products from the backend
  fetchProducts(page: number): void {
    this.loadingService.setLoading(true);
    this.http.get<PaginatedProductsResponse>(`http://localhost:5000/api/products/?page=${page}&limit=${this.limit}`).pipe(
      finalize(() => this.loadingService.setLoading(false))
    ).subscribe(
      (data) => {
        this.products = data.products;
        this.currentPage = data.currentPage;
        this.totalPages = data.totalPages;
        this.sortProducts(this.selectedSort);
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  // Fetch the price range from the backend
  fetchPriceRange(): void {
    this.loadingService.setLoading(true);
    this.http.get('http://localhost:5000/api/products/getPriceRange').subscribe(
      (data: any) => {
        this.minPrice = data.minPrice;
        this.maxPrice = data.maxPrice;
        this.currentPriceRange = this.maxPrice; // Default to max price
      },
      (error) => {
        console.error('Error fetching price range:', error);
      }
    );
  }

  // Apply filter based on the current price range
  applyFilter(): void {
    this.loadingService.setLoading(true);
    this.http
      .get(`http://localhost:5000/api/products/filterByPrice?minPrice=${this.minPrice}&maxPrice=${this.currentPriceRange}`)
      .pipe(
        finalize(() => this.loadingService.setLoading(false))
      )
      .subscribe(
        (data: any) => {
          this.products = data;
          this.currentPage = 1;
          this.totalPages = 1;
          this.sortProducts(this.selectedSort);
        },
        (error) => {
          console.error('Error applying filter:', error);
        }
      );
  }

  // Sort products based on the selected option
  sortProducts(option: string): void {
    this.selectedSort = option;

    switch (option) {
      case 'Price: Low to High':
        this.products.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        this.products.sort((a, b) => b.price - a.price);
        break;
      case 'Most Popular':
        this.products.sort((a, b) => b.bids - a.bids);
        break;
      case 'Newest First':
        this.products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.fetchProducts(this.currentPage - 1);
    }
  }
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.fetchProducts(this.currentPage + 1);
    }
  }
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.fetchProducts(page);
    }
  }

  getPageNumbers(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }
}