import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavComponent } from '../../nav/nav.component';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-your-products',
  imports: [NavComponent, FooterComponent],
  templateUrl: './your-products.component.html',
  styleUrl: './your-products.component.css'
})
export class YourProductsComponent {
  constructor(private router: Router) {}

  addProduct() {
    this.router.navigate(['/sell/description']); 
  }
}
