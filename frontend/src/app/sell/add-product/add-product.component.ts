import { Component } from '@angular/core';
import { FooterComponent } from '../../footer/footer.component';
import { NavComponent } from '../../nav/nav.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-product',
  imports: [FooterComponent,NavComponent,RouterModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {

}
