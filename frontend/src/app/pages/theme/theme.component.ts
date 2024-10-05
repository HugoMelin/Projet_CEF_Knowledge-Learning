import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CoursesService } from '../../services/courses/courses.service';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

interface Course {
  idCourses: number;
  title: string;
  description: string;
  price: number;
  idTheme: number;
}

interface Theme {
  idThemes: number;
  name: string;
}

@Component({
  selector: 'app-theme',
  standalone: true,
  imports: [ CommonModule, RouterLink ],
  templateUrl: './theme.component.html',
  styleUrl: './theme.component.css'
})
export class ThemeComponent implements OnInit {
  logged:boolean = false;
  themeId: number | undefined;
  lessons: any[] = []
  theme: any

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private coursesService : CoursesService,
    private themeService : ThemeService,
  ) {}

  ngOnInit() {
    this.logged = this.authService.isLoggedIn();

    this.route.params.subscribe(params => {
      this.themeId = +params['idTheme'];
    });

    this.coursesService.getCoursesByThemeId(this.themeId).subscribe(
      data => {
        this.lessons = data
      },
      (error) => {
        console.error('Erreur lors de la récupération des cours:', error);
      }
    )

    this.themeService.getThemeById(this.themeId).subscribe(
      data => (
        this.theme = data
      ),
      (error) => (
        console.error('Erreur lors de la récupération du thème:', error)
      )
    )
  }
}
