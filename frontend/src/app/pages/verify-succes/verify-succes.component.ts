import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-verify-succes',
  standalone: true,
  imports: [ RouterLink ],
  templateUrl: './verify-succes.component.html',
  styleUrl: './verify-succes.component.css'
})
export class VerifySuccesComponent implements OnInit, OnDestroy{
  redirectTimeOut: any

  constructor(
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.redirectTimeOut = setTimeout(() => this.router.navigate(['/connexion']), 10000);
  }

  ngOnDestroy(): void {
    clearTimeout(this.redirectTimeOut);
  }
}
