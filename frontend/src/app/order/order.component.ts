import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NavComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';

interface ProductInfo {
  _id: string;
  title: string;
  price: number;
  seller: string;
  image: string;
}

interface OrderItem {
  product: ProductInfo;
  quantity: number;
  subtotal: number;
}

interface Order {
  orderId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'shipped' | 'delivered';
  createdAt: Date;
  itemCount: number;
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, NavComponent, FooterComponent,RouterModule],
})
export class OrderComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  error: string | null = null;
  readonly API_URL = 'http://localhost:5000/api/order';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken'); 
    console.log(token);
    return new HttpHeaders({
      token: `Bearer ${token}` 
    });
  }

  private fetchOrders(): void {
    const headers = this.getAuthHeaders();
    this.loading = true;
    this.http.get<{orders: Order[], totalOrders: number}>(`${this.API_URL}/getOrders`,{headers})
      .subscribe({
        next: (response) => {
          this.orders = response.orders.map(order => ({
            ...order,
            createdAt: new Date(order.createdAt)
          }));
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching orders:', error);
          this.error = error.message || 'An error occurred while fetching orders';
          this.loading = false;
        }
      });
  }

  // Helper method to format currency
  formatPrice(price: number): string {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP'
    }).format(price);
  }

  // Helper method to get status color class
  getStatusColorClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
