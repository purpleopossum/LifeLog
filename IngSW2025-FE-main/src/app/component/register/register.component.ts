import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../service/user.service';
import { User } from '../../dto/user.model';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: '../login/login.component.scss'
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService
  ) {}

  async register() {
    try {
      const user = new User();
      user.username = this.username;
      user.email = this.email;
      user.password = this.password;

      const savedUser = await lastValueFrom(this.userService.create(user));
      localStorage.setItem('user', JSON.stringify(savedUser));
      this.authService.login(savedUser);
      this.router.navigate(['/habits']);
    } catch (error: any) {
      this.errorMessage = error.error;
    }
  }
}
