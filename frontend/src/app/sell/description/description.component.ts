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