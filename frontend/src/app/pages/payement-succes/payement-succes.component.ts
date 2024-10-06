import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payement-succes',
  standalone: true,
  imports: [],
  templateUrl: './payement-succes.component.html',
  styleUrl: './payement-succes.component.css'
})
export class PayementSuccesComponent implements OnInit, OnDestroy{
  redirectTimeOut:any

  constructor(
    private cartService: CartService,
    private router : Router,
  ) {}

  ngOnInit(): void {
    this.cartService.clearCart();
    this.redirectTimeOut = setTimeout(() => this.router.navigate(['/']), 10000);
  }

  ngOnDestroy(): void {
    clearTimeout(this.redirectTimeOut);
  }
}
