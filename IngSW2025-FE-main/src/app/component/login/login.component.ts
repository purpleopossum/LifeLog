import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
  identifier: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router, 
              private authService: AuthService, 
              private userService: UserService
             ) {}
  

  async login() {
    this.userService.login(this.identifier.trim(), this.password).subscribe({
      next: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        this.authService.login(user);
        this.router.navigate(['/habits']);
      },
      error: (err) => {
        if (err.status === 401) {
            this.errorMessage = 'Wrong credentials';
        } else {
            this.errorMessage = 'Error connecting to the server';
        }
      }
    });
  }
}
