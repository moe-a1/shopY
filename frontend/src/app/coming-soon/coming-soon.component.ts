import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-coming-soon',
  imports: [FooterComponent,NavComponent],
  templateUrl: './coming-soon.component.html',
  styleUrl: './coming-soon.component.css'
})
export class ComingSoonComponent {

}
