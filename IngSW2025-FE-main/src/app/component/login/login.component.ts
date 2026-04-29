import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService ) {}
  

  async login() {
    this.http.get<any>(`/api/user/username/${this.username}`, { withCredentials: true }).subscribe({
      next: (user) => {
        if (user && user.password === this.password) {
          localStorage.setItem('user', JSON.stringify(user));
          this.authService.login(user);
          this.router.navigate(['/habits']);
        } else {
          this.errorMessage = 'Password errata';
        }
      },
      error: () => {
        this.errorMessage = 'Utente non trovato';
      }
    });
  }
}
