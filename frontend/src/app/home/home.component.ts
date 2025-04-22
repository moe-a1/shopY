import { Component, OnInit } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs/operators';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: any[];
  quantity: number;
  seller: {
    _id: string;
    username: string;
  };
}

@Component({
  selector: 'app-home',
  imports: [
    NavComponent, 
    FooterComponent, 
    RouterModule, 
    CommonModule, 
    HttpClientModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  days: number = 6;
  hours: number = 23;
  minutes: number = 6;
  seconds: number = 58;
  products: Product[] = [];
  hoveredProduct: string | null = null; // Track the hovered product ID

  private interval: any;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.startCountdown();
    this.fetchRandomProducts();
  }

  fetchRandomProducts(): void {
    this.loadingService.setLoading(true);
    this.http.get<Product[]>('http://localhost:5000/api/products/random/8')
      .pipe(
        finalize(() => this.loadingService.setLoading(false))
      )
      .subscribe(
        (data) => {
          this.products = data;
        },
        (error) => {
          console.error('Error fetching random products:', error);
        }
      );
  }

  startCountdown() {
    this.interval = setInterval(() => {
      if (this.seconds > 0) {
        this.seconds--;
      } else if (this.minutes > 0) {
        this.minutes--;
        this.seconds = 59;
      } else if (this.hours > 0) {
        this.hours--;
        this.minutes = 59;
        this.seconds = 59;
      } else if (this.days > 0) {
        this.days--;
        this.hours = 23;
        this.minutes = 59;
        this.seconds = 59;
      } else {
        clearInterval(this.interval);
        this.resetCountdown();
        this.startCountdown();
      }
    }, 1000);
  }

  resetCountdown() {
    this.days = 6;
    this.hours = 23;
    this.minutes = 6;
    this.seconds = 58;
  }
}
