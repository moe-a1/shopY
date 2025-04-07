import { Component, OnInit } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  imports: [NavComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  days: number = 6;
  hours: number = 23;
  minutes: number = 6;
  seconds: number = 58;

  // The interval to update the countdown every second
  private interval: any;

  ngOnInit(): void {
    this.startCountdown();
  }

  // Function to start the countdown
  startCountdown() {
    this.interval = setInterval(() => {
      if (this.seconds > 0) {
        this.seconds--;
      } else if (this.minutes > 0) {
        this.minutes--;
        this.seconds = 59;
      } else if (this.hours > 0) {
        this.hours--;
        this.minutes = 59;
        this.seconds = 59;
      } else if (this.days > 0) {
        this.days--;
        this.hours = 23;
        this.minutes = 59;
        this.seconds = 59;
      } else {
        clearInterval(this.interval); // Stop the countdown when it reaches zero
        this.resetCountdown(); // Reset the countdown after it finishes
        this.startCountdown(); // Restart the countdown
      }
    }, 1000); // Update every second
  }

  // Function to reset the countdown to initial values
  resetCountdown() {
    this.days = 6;
    this.hours = 23;
    this.minutes = 6;
    this.seconds = 58;
  }
}
