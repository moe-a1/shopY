import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { NavComponent } from '../nav/nav.component';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  imports: [FooterComponent,NavComponent,RouterModule, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';
  success: string = '';
  showAlert: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    this.error = '';
    this.success = '';
    this.showAlert = true;
    
    const payload = {
      email: this.email,
      password: this.password
    };

    this.http.post<any>('http://localhost:5000/api/auth/login', payload).subscribe({
      next: (res) => {
        this.success = 'Login successful! Redirecting...';
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('user', JSON.stringify(res));
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1500);
      },
      error: (err) => {
        if (err.status === 404 || err.status === 400) {
          this.error = err.error;
        } else {
          this.error = 'An unexpected error occurred. Please try again later.';
        }
        setTimeout(() => {
          this.showAlert = false;
        }, 5000);
      }
    });
  }
}