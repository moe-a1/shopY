import { Component } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-bazaar-page',
  imports: [NavComponent,FooterComponent],
  templateUrl: './bazaar-page.component.html',
  styleUrl: './bazaar-page.component.css'
})
export class BazaarPageComponent {

}
