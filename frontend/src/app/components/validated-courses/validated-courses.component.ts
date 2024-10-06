import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CoursesService } from '../../services/courses/courses.service';

interface CompletedCourse {
  idUser: number;
  idCourses: number;
  completedDate: string;
  courseTitle?: string;
  themeTitle?: string;
}

@Component({
  selector: 'app-validated-courses',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './validated-courses.component.html',
  styleUrl: './validated-courses.component.css'
})
export class ValidatedCoursesComponent implements OnInit {
  userId: number | undefined;
  validatedCourses: CompletedCourse[] = [];

  constructor(
    private authService: AuthService,
    private courseService: CoursesService,
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUser()?.idUser;

    this.loadValidatedCourses();
  }

  loadValidatedCourses(): void {
    this.courseService.getValidatedCourses(this.userId).subscribe(
      (courses) => {
        this.validatedCourses = courses;
      },
      (error) => {
        console.error('Erreur lors de la récupération des cours validés', error);
      }
    );
  }
}
