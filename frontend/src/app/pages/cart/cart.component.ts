import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { CommonModule } from '@angular/common';
import { EuroCurrencyPipe } from '../../pipes/euro-currency.pipe';
import { Subscription } from 'rxjs';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  type: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [ CommonModule, EuroCurrencyPipe ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit, OnDestroy {
  items: CartItem[] = [];
  itemCount: number = 0;
  total: number = 0;
  private cartSubscription: Subscription | undefined;
  private totalSubscription: Subscription | undefined;

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.cartSubscription = this.cartService.getItems().subscribe(
      (cartItems) => {
        this.items = cartItems;
        this.updateCartInfo();
      }
    );

    this.totalSubscription = this.cartService.getCartTotal().subscribe(
      (total) => {
        this.total = total;
      }
    );
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.totalSubscription) {
      this.totalSubscription.unsubscribe();
    }
  }

  private updateCartInfo() {
    this.itemCount = this.items.reduce((count, item) => count + item.quantity, 0);
  }

  removeItem(item: CartItem) {
    this.cartService.removeFromCart(item);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  payer() {
    console.log('Click')
  }
}