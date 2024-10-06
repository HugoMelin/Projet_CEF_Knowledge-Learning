import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private cartTotal = new BehaviorSubject<number>(0);

  constructor() {
    this.loadCart();
   }

  private loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems.next(JSON.parse(savedCart));
      this.updateCartTotal();
    }
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems.value));
  }

  addToCart(product: CartItem) {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.id === product.id && item.type === product.type);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentItems.push(product);
    }

    this.cartItems.next(currentItems);
    this.updateCartTotal();
    this.saveCart();
  }

  getItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  clearCart() {
    this.cartItems.next([]);
    this.updateCartTotal();
    localStorage.removeItem('cart');
  }

  getCartItemCount(): Observable<number> {
    return this.cartItems.pipe(
      map(items => items.reduce((count, item) => count + item.quantity, 0))
    );
  }

  getCartTotal(): Observable<number> {
    return this.cartTotal.asObservable();
  }

  private updateCartTotal() {
    const total = this.cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.cartTotal.next(total);
  }

  getCartItemsForDatabase(): CartItem[] {
    return this.cartItems.value.map(item => ({
      name: item.name,
      price: item.price,
      type: item.type,
      quantity: item.quantity,
      id: item.id,
    }));
  }

  removeFromCart(item: CartItem) {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.filter(
      cartItem => !(cartItem.id === item.id && cartItem.type === item.type)
    );

    this.cartItems.next(updatedItems);
    this.updateCartTotal();
    this.saveCart();
  }
}