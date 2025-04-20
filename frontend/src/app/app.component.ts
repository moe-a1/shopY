import { Component } from '@angular/core';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [LoadingSpinnerComponent, RouterOutlet]
})
export class AppComponent {
  title = 'frontend';
}
