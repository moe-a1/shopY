import { Component } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs/operators';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

interface PaginatedProductsResponse {
  products: any[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
}

@Component({
  selector: 'app-category',
  imports: [
    NavComponent, 
    FooterComponent, 
    CommonModule, 
    FormsModule, 
    HttpClientModule, 
    RouterLink,
    LoadingSpinnerComponent
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  products: any[] = []; // Array to store products
  categoryName: string = ''; // To store the category name from URL
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
    private route: ActivatedRoute,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    // Get the category name from the route parameters
    this.route.params.subscribe(params => {
      this.categoryName = params['categoryName'];
      this.fetchProductsByCategory(this.currentPage);
      this.fetchPriceRange();
    });
  }

  fetchProductsByCategory(page: number): void {
    this.loadingService.setLoading(true);
    const formattedCategoryName = this.categoryName.charAt(0).toUpperCase() + this.categoryName.slice(1);
    this.http.get<PaginatedProductsResponse>(`http://localhost:5000/api/products/category/${formattedCategoryName}?page=${page}&limit=${this.limit}`).pipe(
      finalize(() => this.loadingService.setLoading(false))
    ).subscribe(
      (data) => {
        this.products = data.products;
        this.currentPage = data.currentPage;
        this.totalPages = data.totalPages;
        this.sortProducts(this.selectedSort);
      },
      (error) => {
        console.error('Error fetching products by category:', error);
      }
    );
  }

  // Fetch the price range from the backend
  fetchPriceRange(): void {
    this.loadingService.setLoading(true);
    const formattedCategoryName = this.categoryName.charAt(0).toUpperCase() + this.categoryName.slice(1);
    this.http.get(`http://localhost:5000/api/products/category/${formattedCategoryName}/getPriceRange`).subscribe(
      (data: any) => {
        this.minPrice = data.minPrice;
        this.maxPrice = data.maxPrice;
        this.currentPriceRange = this.maxPrice; // Default to max price
      },
      (error) => {
        console.error('Error fetching category price range:', error);
      }
    );
  }

  // Apply filter based on the current price range
  applyFilter(): void {
    this.loadingService.setLoading(true);
    this.http.get(`http://localhost:5000/api/products/category/${this.categoryName}/filter?minPrice=${this.minPrice}&maxPrice=${this.currentPriceRange}`).pipe(
      finalize(() => this.loadingService.setLoading(false))
    ).subscribe(
      (data: any) => {
        this.products = data;
        this.currentPage = 1;
        this.totalPages = 1;
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
      this.fetchProductsByCategory(this.currentPage - 1);
    }
  }
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.fetchProductsByCategory(this.currentPage + 1);
    }
  }
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.fetchProductsByCategory(page);
    }
  }
  getPageNumbers(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }
}
