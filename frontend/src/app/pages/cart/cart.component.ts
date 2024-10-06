import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  items: any[] = [];

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.items = this.cartService.getItems();
  }
}
