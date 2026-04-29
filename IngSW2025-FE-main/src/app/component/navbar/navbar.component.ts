import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service'; 

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class NavbarComponent implements OnInit {
  loggedOn = false;
  menuActiveLink = '';
  loggedUser: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.loggedUser = user;
      this.loggedOn = !!user;
    });
  }
  
  get isLoginPage() {
    return this.router.url === '/login';
  }

  get isRegisterPage() {
    return this.router.url === '/register';
  }
  
  setActive(link: string) {
    this.menuActiveLink = link;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
