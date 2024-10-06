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
  pagedThemes: any[] = [];
  currentPage: number = 1;
  pageSize: number = 9;
  totalPages: number = 0;

  constructor(private themeService: ThemeService) { }

  ngOnInit() {
    this.themeService.getThemes().subscribe(
      (data) => {
        this.themes = data;
        this.totalPages = Math.ceil(this.themes.length / this.pageSize);
        this.setPage(1);
      },
      (error) => {
        console.error('Erreur lors de la récupération des thèmes:', error);
      }
    );
  }

  setPage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    this.pagedThemes = this.themes.slice(startIndex, startIndex + this.pageSize);
  }
}
