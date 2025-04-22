import { Component } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [NavComponent, FooterComponent, RouterModule, FormsModule, HttpClientModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  formData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  };

  error: string = '';
  success: string = '';
  showAlert: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    this.error = '';
    this.success = '';
    this.showAlert = true;

    if (this.formData.password !== this.formData.confirmPassword) {
      this.error = 'Passwords do not match';
      setTimeout(() => {
        this.showAlert = false;
      }, 5000);
      return;
    }

    this.http.post('http://localhost:5000/api/auth/register', this.formData)
      .subscribe({
        next: (res) => {
          this.success = 'Registration successful! Redirecting to login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (err) => {
          this.error = err.error?.error || 'Registration failed';
          setTimeout(() => {
            this.showAlert = false;
          }, 5000);
        }
      });
  }
}
