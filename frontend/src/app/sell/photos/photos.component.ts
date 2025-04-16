import { Component } from '@angular/core';
import { NavComponent } from '../../nav/nav.component';
import { FooterComponent } from '../../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Photo {
  id: string;
  url: string;
  name: string;
  size: string;
}

@Component({
  selector: 'app-photos',
  imports: [NavComponent, FooterComponent, FormsModule, CommonModule, RouterLink, HttpClientModule], // Add HttpClientModule here
  templateUrl: './photos.component.html',
  styleUrl: './photos.component.css'
})
export class PhotosComponent {
  constructor(private http: HttpClient, private router: Router) {}
  
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
    // Retrieve product data from localStorage
    const productData = JSON.parse(localStorage.getItem('productData') || '{}');
  
    // Add photos to the product data
    productData.images = this.photos.map(photo => photo.url);
  
    // Retrieve the token from localStorage
    const token = localStorage.getItem('accessToken');
  
    // Send the complete product data to the backend with the token in the headers
    console.log('Sending product:', productData);

    this.http.post('http://localhost:5000/api/products/', productData, {
      headers: {
        token: `Bearer ${token}` // Include the token in the Authorization header
      }
    }).subscribe({
      next: (response) => {
        console.log('Product created successfully:', response);
        localStorage.removeItem('productData'); // Clear localStorage
        this.router.navigate(['/sell/userProducts']); // Navigate to the user products page
      },
      error: (error) => {
        console.error('Error creating product:', error);
      }
    });
  }
}