import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; 
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
  ],
})
export class SettingsComponent implements OnInit {
  userData = {
    username: '',
    email: '',
    phone: '',
    address: '',
  };
  userId: string = ''; // Store the user ID

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.userData = { ...user };
      this.userId = user._id; // Assuming the user object contains an `_id` field
    }
  }

  updateSettings(): void {
    this.authService.updateUser(this.userId, this.userData).subscribe(
      (response) => {
        alert('Settings updated successfully!');
        this.authService.setUser(response); // Update the local user data
      },
      (error) => {
        console.error('Error updating settings:', error);
        alert('Failed to update settings. Please try again.');
      }
    );
  }
}
