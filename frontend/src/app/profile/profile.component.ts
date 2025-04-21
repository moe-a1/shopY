import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { NavComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';
import { Location } from '@angular/common';

interface UserProfile {
  username: string;
  email: string;
  password?: string; // optional
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NavComponent, FooterComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: UserProfile = {
    username: '',
    email: ''
  };

  private userId: string = '';

  constructor(private http: HttpClient, private authService: AuthService, private location: Location) {}

  ngOnInit() {
    const currentUser = this.authService.getUser();
    if (currentUser && currentUser._id) {
      this.userId = currentUser._id;
      this.getUserProfile();
    } else {
      console.error('User not found in local storage.');
    }
  }

  getUserProfile() {
    this.http.get<any>(`http://localhost:5000/api/user/${this.userId}`, {
      headers: {
        token: `Bearer ${localStorage.getItem('accessToken')}`
      }
    }).subscribe({
      next: (data) => {
        this.user.username = data.username;
        this.user.email = data.email;
      },
      error: (err) => console.error('Error fetching profile:', err)
    });
  }

  // profile.component.ts
updateProfile() {
  const payload = { ...this.user };

  // Remove password from payload if left blank
  if (!payload.password) {
    delete payload.password;
  }

  this.http.put<any>(`http://localhost:5000/api/user/${this.userId}`, payload, {
    headers: {
      token: `Bearer ${localStorage.getItem('accessToken')}`
    }
  }).subscribe({
    next: (data) => {
      // Update the user data in localStorage after a successful update
      localStorage.setItem('user', JSON.stringify(data));  // Update localStorage
      alert('Profile updated successfully!');
    },
    error: (err) => {
      console.error('Update error:', err);
      alert('Failed to update profile.');
    }
  });
}

  goBack(): void {
    this.location.back();
  }
}
