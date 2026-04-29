import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.getCurrentUser() || JSON.parse(localStorage.getItem('user') || 'null');

    if (user) {
      this.router.navigate(['/habit']);
      return false;
    }
    return true;
  }
}
