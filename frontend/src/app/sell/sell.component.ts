import { Component } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sell',
  standalone: true,
  imports: [NavComponent, FooterComponent, RouterModule, CommonModule],
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css']
})
export class SellComponent {
  frontImage: File | null = null;
  backImage: File | null = null;

  frontPreview: string | ArrayBuffer | null = null;
  backPreview: string | ArrayBuffer | null = null;

  onFileSelected(event: Event, side: 'front' | 'back'): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        alert('Only image files are allowed.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (side === 'front') {
          this.frontImage = file;
          this.frontPreview = reader.result;
        } else {
          this.backImage = file;
          this.backPreview = reader.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
