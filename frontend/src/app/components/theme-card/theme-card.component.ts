import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { RouterLink } from '@angular/router';

interface Theme {
  idThemes: number;
  name: string;
}

@Component({
  selector: 'app-theme-card',
  standalone: true,
  imports: [ CommonModule, RouterLink ],
  templateUrl: './theme-card.component.html',
  styleUrl: './theme-card.component.css'
})
export class ThemeCardComponent implements OnInit {
  @Input() theme: any;
  themes: any[] = [];

  constructor(private themeService: ThemeService) { }

  ngOnInit() {
    this.themeService.getThemes().subscribe(
      (data) => {
        this.themes = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des thèmes:', error);
      }
    );
  }
}
