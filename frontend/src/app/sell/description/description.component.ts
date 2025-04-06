import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavComponent } from '../../nav/nav.component';
import { FooterComponent } from '../../footer/footer.component';
import { RouterModule } from '@angular/router';

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


}
