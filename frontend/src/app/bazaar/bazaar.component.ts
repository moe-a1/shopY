import { Component } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-bazaar',
  imports: [NavComponent,FooterComponent],
  templateUrl: './bazaar.component.html',
  styleUrl: './bazaar.component.css'
})
export class BazaarComponent {

}
