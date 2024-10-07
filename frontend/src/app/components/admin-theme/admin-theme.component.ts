import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Theme {
  idThemes: number;
  name: string;
}

@Component({
  selector: 'app-admin-theme',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './admin-theme.component.html',
  styleUrl: './admin-theme.component.css'
})
export class AdminThemeComponent implements OnInit {
  themes: Theme[] = [];
  currentTheme: Theme | null = null;
  modalMode: 'add' | 'edit' = 'add';
  themeName: string = '';
  errorMsg : string = '';
  pagedThemes: any[] = [];
  currentPage: number = 1;
  pageSize: number = 20;
  totalPages: number = 0;

  @ViewChild('themeModal') themeModal!: ElementRef;

  constructor(
    private themeService: ThemeService,
  ) { }

  ngOnInit(): void {
    this.loadThemes();
  }

  loadThemes(): void {
    this.themeService.getThemes().subscribe(
      (themes) => {
        this.themes = themes;
        this.totalPages = Math.ceil(this.themes.length / this.pageSize);
        this.setPage(1);
      },
      (error) => {
        console.error('Erreur lors du chargement des thèmes:', error);
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

  openAddThemeModal(): void {
    this.modalMode = 'add';
    this.themeName = '';
    this.currentTheme = null;
    this.openModal();
  }

  openEditThemeModal(theme: Theme): void {
    this.modalMode = 'edit';
    this.themeName = theme.name;
    this.currentTheme = theme;
    this.openModal();
  }

  openModal(): void {
    (this.themeModal.nativeElement as HTMLElement).classList.add('show');
    (this.themeModal.nativeElement as HTMLElement).style.display = 'block';
  }

  closeModal(): void {
    (this.themeModal.nativeElement as HTMLElement).classList.remove('show');
    (this.themeModal.nativeElement as HTMLElement).style.display = 'none';
  }

  saveTheme(): void {
    if (this.modalMode === 'add') {
      this.themeService.addTheme(this.themeName).subscribe(
        () => {
          this.loadThemes();
          this.closeModal();
        },
        (error: any) => {
          console.error('Erreur lors de l\'ajout du thème:', error);
          this.errorMsg = 'Erreur lors de l\'ajout du thème.'
        }
      );
    } else {
      if (this.currentTheme) {
        this.themeService.updateTheme(this.currentTheme.idThemes, this.themeName).subscribe(
          () => {
            this.loadThemes();
            this.closeModal();
          },
          (error: any) => {
            console.error('Erreur lors de la modification du thème:', error);
            this.errorMsg = 'Erreur lors de la modification du thème.'
          }
        );
      }
    }
  }

  deleteTheme(themeId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce thème ?')) {
      this.themeService.deleteTheme(themeId).subscribe(
        () => {
          this.loadThemes();
        },
        (error: any) => {
          console.error('Erreur lors de la suppression du thème:', error);
          this.errorMsg = 'Vous ne pouvez pas supprimer le thème.'
        }
      );
    }
  }
}