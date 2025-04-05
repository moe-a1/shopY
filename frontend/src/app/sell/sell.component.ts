import { Component } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-sell',
  imports: [NavComponent,FooterComponent],
  templateUrl: './sell.component.html',
  styleUrl: './sell.component.css'
})
export class SellComponent {

}
