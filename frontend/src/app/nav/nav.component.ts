import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http'; // Import HttpClientModule and HttpClient
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { filter } from 'rxjs/operators';
import { AuthService } from '../services/auth.service'; // adjust path if needed

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule], // Add FormsModule here
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  isBazaarPage = false;
  isLoggedIn = false;
  username: string = '';
  dropdownOpen = false;
  searchQuery: string = ''; // Add searchQuery property
  searchResults: any[] = []; // Add a property to store search results
  showDropdown: boolean = false; // Add a property to control dropdown visibility

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient // Inject HttpClient
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isBazaarPage = event.urlAfterRedirects === '/bazaar';
        this.isLoggedIn = this.authService.isLoggedIn();
        if (this.isLoggedIn) {
          const user = this.authService.getUser();
          this.username = user?.username || 'User';
        }
      });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  search() {
    if (this.searchQuery.trim()) {
      this.http
        .get<any[]>(`http://localhost:5000/api/products/search/query?q=${encodeURIComponent(this.searchQuery)}`)
        .subscribe(
          (results) => {
            this.searchResults = results; // Store the search results
            this.showDropdown = true; // Show the dropdown
          },
          (error) => {
            console.error('Error during search:', error);
            this.searchResults = []; // Clear results on error
            this.showDropdown = false; // Hide the dropdown
          }
        );
    } else {
      this.searchResults = []; // Clear results if the query is empty
      this.showDropdown = false; // Hide the dropdown
    }
  }

  hideDropdown() {
    this.showDropdown = false; // Hide the dropdown when needed
  }

  navigateToProduct(productId: string) {
    this.hideDropdown(); // Hide the dropdown
    this.router.navigate([`/product/${productId}`]); // Navigate to the product page
  }
}