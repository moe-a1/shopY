import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavComponent } from '../../nav/nav.component';
import { FooterComponent } from '../../footer/footer.component';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-description',
  imports: [FormsModule, NavComponent, FooterComponent, RouterModule],
  templateUrl: './description.component.html',
  styleUrl: './description.component.css'
})
export class DescriptionComponent {
  productName: string = '';
  availability: string = '';
  description: string = '';
  dimensions = {
    length: 0,
    width: 0,
    height: 0
  };
  price: number = 0;

  constructor(private router: Router) {}

  onNext() {
    if (!this.productName || !this.availability || !this.description || !this.price) {
      const notification = document.getElementById('error-notification');
      if (notification) {
        notification.style.display = 'block';
        setTimeout(() => {
          notification.style.display = 'none';
        }, 3000); // Hide after 3 seconds
      }
      return;
    }

    // Proceed to the next step
    console.log('All fields are valid. Proceeding to the next step...');

    const productData = {
      title: this.productName,
      description: this.description,
      price: this.price,
      quantity: this.availability,
    };

    // Save product data to localStorage
    localStorage.setItem('productData', JSON.stringify(productData));
    console.log(productData);

    // Navigate to the next step
    this.router.navigate(['/sell/categories']);
  }
}