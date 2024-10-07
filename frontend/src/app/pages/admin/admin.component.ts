import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  logged:boolean = false;
  currentComponent:string = 'profile'

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.logged = this.authService.isLoggedIn();

    if (!this.logged) {
      this.router.navigate(['/connexion']);
    }

  }

  showComponent(component: string) {
    this.currentComponent = component;
  }
}
