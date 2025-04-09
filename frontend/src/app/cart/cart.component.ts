import { Component, OnInit } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

interface CartItem {
  id: number;
  name: string;
  price: number;
  seller: string;
  image: string;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NavComponent, FooterComponent, CommonModule, FormsModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  shippingCost: number = 50;
  discount: number = 0;
  promoCode: string = '';
  
  constructor(private router: Router) {}
  
  ngOnInit(): void {
    this.loadCartItems();
  }
  
  loadCartItems(): void {
    this.cartItems = [
      {
        id: 1,
        name: 'Head Phone',
        price: 950,
        seller: 'John Doe',
        image: 'images/Frame 33.png',
        quantity: 1
      },
      {
        id: 3,
        name: 'Rolex Watch',
        price: 1000,
        seller: 'Mike Johnson',
        image: 'images/Frame 905.png',
        quantity: 2
      }
    ];
  }
  
  increaseQuantity(item: CartItem): void {
    item.quantity++;
  }
  
  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }
  
  removeItem(item: CartItem): void {
    this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
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
    // if (this.cartItems.length > 0) {
    //   // Navigate to checkout page (you would implement this route)
    //   this.router.navigate(['/checkout']);
    // }
  }
}