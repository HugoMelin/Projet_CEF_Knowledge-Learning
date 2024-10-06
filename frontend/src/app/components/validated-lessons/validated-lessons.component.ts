import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LessonsService } from '../../services/lessons/lessons.service';
import { CommonModule } from '@angular/common';

interface CompletedLesson {
  idUser:number;
  idLessons:number;
  completedDate:string;
  lessonTitle?: string;
  courseTitle?: string;
}

@Component({
  selector: 'app-validated-lessons',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './validated-lessons.component.html',
  styleUrl: './validated-lessons.component.css'
})
export class ValidatedLessonsComponent implements OnInit {
  validatedLessons: CompletedLesson[] = [];
  userId: number | undefined;

  constructor(
    private authService: AuthService,
    private lessonService: LessonsService,
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUser()?.idUser;

    this.loadValidatedLessons();
  }

  loadValidatedLessons(): void {
    this.lessonService.getValidatedLessons(this.userId).subscribe(
      (lessons) => {
        this.validatedLessons = lessons;
      },
      (error) => {
        console.error('Erreur lors du chargement des leçons validées:', error);
      }
    );
  }
}
