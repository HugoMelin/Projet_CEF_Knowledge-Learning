import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart/cart.service';
import { EuroCurrencyPipe } from '../../pipes/euro-currency.pipe';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ RouterLink, RouterLinkActive, CommonModule, EuroCurrencyPipe ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  logged:boolean = false;
  total: number = 0;
  private authSubscription : Subscription = new Subscription;
  private totalSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.logged = this.authService.isLoggedIn();

    this.authSubscription = this.authService.currentUser.subscribe(() => {
      this.logged = this.authService.isLoggedIn();
    });

    this.totalSubscription = this.cartService.getCartTotal().subscribe(
      (total) => {
        this.total = total;
      }
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }

    if (this.totalSubscription) {
      this.totalSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/connexion']);
  }
}
