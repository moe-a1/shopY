import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService } from '../services/auth.service'; // adjust path if needed

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  isBazaarPage = false;
  isLoggedIn = false;
  username: string = '';
  dropdownOpen = false;

  constructor(private router: Router, private authService: AuthService) {
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
}