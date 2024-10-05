import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ThemeCardComponent } from './components/theme-card/theme-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet, RouterLink, FooterComponent, HeaderComponent, ThemeCardComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  router = inject(Router);
}
