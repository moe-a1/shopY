import { Component, OnInit } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http'; 

interface CartItem {
  id: number;
  name: string;
  price: number;
  seller: string;
  image: [string];
  quantity: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NavComponent, FooterComponent, CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  shippingCost: number = 50;
  discount: number = 0;
  promoCode: string = '';
  private apiUrl = 'http://localhost:5000/api/cart'; // Replace with your backend URL

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken'); 
    console.log(token);
    return new HttpHeaders({
      token: `Bearer ${token}` 
    });
  }

  loadCartItems(): void {
    const headers = this.getAuthHeaders();
    this.http.get<{ products: CartItem[] }>(`${this.apiUrl}/getCart`, { headers }).subscribe(
      (response) => {
        this.cartItems = response.products.map((item: any) => ({
          id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          seller: item.product.seller, 
          image: item.product.image[0],
          quantity: item.quantity,
        }));
      },
      (error) => {
        console.error('Error fetching cart items:', error);
      }
    );
  }

  increaseQuantity(item: CartItem): void {
    const headers = this.getAuthHeaders();
    this.http.post(`${this.apiUrl}/updateCart`, { productId: item.id, quantity: 1 }, { headers }).subscribe(
      () => {
        item.quantity++;
      },
      (error) => {
        console.error('Error increasing quantity:', error);
      }
    );
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      const headers = this.getAuthHeaders();
      this.http.post(`${this.apiUrl}/updateCart`, { productId: item.id, quantity: -1 }, { headers }).subscribe(
        () => {
          item.quantity--;
        },
        (error) => {
          console.error('Error decreasing quantity:', error);
        }
      );
    }
  }

  removeItem(item: CartItem): void {
    const headers = this.getAuthHeaders();
    this.http.delete(`${this.apiUrl}/removeProduct/${item.id}`, { headers }).subscribe(
      () => {
        this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
      },
      (error) => {
        console.error('Error removing item:', error);
      }
    );
  }

  calculateSubtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.shippingCost - this.discount;
  }

  applyPromoCode(): void {
    if (this.promoCode.toLowerCase() === 'discount10') {
      this.discount = Math.round(this.calculateSubtotal() * 0.1);
      alert('Promo code applied successfully!');
    } else {
      alert('Invalid promo code');
      this.discount = 0;
    }
    this.promoCode = '';
  }

  proceedToCheckout(): void {
    if (this.cartItems.length > 0) {
      this.router.navigate(['/checkout']);
    }
  }
}