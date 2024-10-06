import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payement-cancel',
  standalone: true,
  imports: [],
  templateUrl: './payement-cancel.component.html',
  styleUrl: './payement-cancel.component.css'
})
export class PayementCancelComponent implements OnInit, OnDestroy {
  redirectTimeOut:any

  constructor(
    private router : Router,
  ) {}

  ngOnInit(): void {
    this.redirectTimeOut = setTimeout(() => this.router.navigate(['/panier']), 10000);
  }

  ngOnDestroy(): void {
    clearTimeout(this.redirectTimeOut);
  }
}
