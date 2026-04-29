import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root'})
export class AuthService {
  private loggedInUser = new BehaviorSubject<any | null>(this.getUserFromStorage());
  public user$ = this.loggedInUser.asObservable(); // Observable che la navbar può sottoscrivere

  private getUserFromStorage(): any | null {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  login(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.loggedInUser.next(user);
  }

  logout(): void {
    localStorage.removeItem('user');
    this.loggedInUser.next(null);
  }

  getCurrentUser(): any | null {
    return this.loggedInUser.getValue();
  }
}
