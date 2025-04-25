import { Component } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bazaar',
  imports: [NavComponent,FooterComponent,RouterModule],
  templateUrl: './bazaar.component.html',
  styleUrl: './bazaar.component.css'
})
export class BazaarComponent {

}
