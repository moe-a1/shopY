import { Component } from '@angular/core';
import { NavComponent } from '../../nav/nav.component';
import { FooterComponent } from '../../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [NavComponent, FooterComponent, FormsModule],
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent {
  constructor(private router: Router) {}

  // Delivery option states
  deliveryOptions = {
    selfPickup: false,
    onlinePayment: false,
    cod: false
  };

  // Shipping date state
  shippingDate: string = '';

  // Handle the "Next" button
  onNext() {
    console.log('Selected Options:', this.deliveryOptions);
    console.log('Selected Date:', this.shippingDate);

    // Example validation (you can replace this with your own logic or navigation)
    if (!this.deliveryOptions.selfPickup && !this.deliveryOptions.onlinePayment && !this.deliveryOptions.cod) {
      alert('Please select at least one delivery option.');
      return;
    }

    if (!this.shippingDate) {
      alert('Please choose a shipping date.');
      return;
    }

    // If everything is filled, continue to the next step
    alert('Delivery details saved successfully!');
    // Navigate or process the data as needed
    this.router.navigate(['/sell/userProducts']); 
  }
}
