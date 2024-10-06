import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: any[] = [];
  private cartItemCount = new BehaviorSubject(0);
  private cartTotal: number = 0 ;

  constructor() { }

  addToCart(product: any) {
    this.cartItems.push(product);
    this.cartItemCount.next(this.cartItems.length);
    this.cartTotal += this.cartTotal;
  }

  getItems() {
    return this.cartItems;
  }

  clearCart() {
    this.cartItems = [];
    this.cartItemCount.next(0);
    this.cartTotal = 0;
    return this.cartItems;
  }

  getCartItemCount() {
    return this.cartItemCount.asObservable();
  }

  getCartTotal() {
    return this.cartTotal;
  }
}