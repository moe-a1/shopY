import { Component } from '@angular/core';
import { NavComponent } from '../../nav/nav.component';
import { FooterComponent } from '../../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

interface Photo {
  id: string;
  url: string;
  name: string;
  size: string;
}

@Component({
  selector: 'app-photos',
  imports: [NavComponent, FooterComponent, FormsModule, CommonModule,RouterLink],
  templateUrl: './photos.component.html',
  styleUrl: './photos.component.css'
})
export class PhotosComponent {
  constructor(private router: Router) {}
  
  photos: Photo[] = [];

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach(file => {
        if (this.photos.length >= 10) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
          this.photos.push({
            id: Math.random().toString(36).substr(2, 9),
            url: e.target?.result as string,
            name: file.name,
            size: this.formatFileSize(file.size)
          });
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removePhoto(id: string) {
    this.photos = this.photos.filter(photo => photo.id !== id);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onNext() {
    console.log('Photos:', this.photos);
    this.router.navigate(['/sell/delivery']); 
  }
}
