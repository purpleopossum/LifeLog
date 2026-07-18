import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-premium-checkout',
  templateUrl: './checkout-premium.component.html',
  styleUrls: ['./checkout-premium.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class PremiumCheckoutComponent {
    cardName: string = '';
    cardNumber: string = '';
    expiryDate: string = '';
    cvv: string = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {}

  simulatePaymentSuccess() {
    const currentUser = JSON.parse(localStorage.getItem('user')!);
    if (!currentUser || !currentUser.id) {
        alert('User session not found!');
        return;
    }

    this.userService.setPremium(currentUser.id, true).subscribe({
        next: (updatedUser) => {
            localStorage.setItem('user', JSON.stringify(updatedUser));

            this.authService.login(updatedUser);
            alert('Welcome to Premium!');
            this.router.navigate(['/habits']);
        },
        error: (err) => {
            console.error('Failed to sync premium with backend:', err)
        }
    });

  }

    onCardNumberInput(event: Event): void {
      const input = event.target as HTMLInputElement;
      let sanitized = input.value.replace(/[^0-9]/g, '');
      
      sanitized = sanitized.match(/.{1,4}/g)?.join(' ') || sanitized;
    
      this.cardNumber = sanitized;
      input.value = sanitized;
    }

    onCvvInput(event: Event): void {
      const input = event.target as HTMLInputElement;
      let sanitized = input.value.replace(/[^0-9]/g, '');
      
      sanitized = sanitized.match(/.{1,4}/g)?.join(' ') || sanitized;
    
      this.cvv = sanitized;
      input.value = sanitized;
    }
    
    onExpiryInput(event: Event): void {
      const input = event.target as HTMLInputElement;
      let value = input.value.replace(/[^0-9]/g, '');
    
      if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
    
      this.expiryDate = value;
      input.value = value;
    }
}
