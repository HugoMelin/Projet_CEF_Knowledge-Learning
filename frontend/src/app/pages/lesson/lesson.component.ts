import { Component, OnInit } from '@angular/core';
import { LessonsService } from '../../services/lessons/lessons.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

interface Lesson {
  idLessons:number;
  title:string;
  content:string;
  videoUrl:string;
  price:number;
  idCourses:number;
}

@Component({
  selector: 'app-lesson',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './lesson.component.html',
  styleUrl: './lesson.component.css'
})
export class LessonComponent implements OnInit{
  lesson:Lesson | undefined;
  idLesson:number | undefined;
  idUser:number | undefined;
  isLessonCompleted: boolean = false;

  constructor(
    private lessonsService: LessonsService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idLesson = +params['idLesson'];

      this.idUser = this.authService.getUser()?.idUser;

      this.checkLessonCompletion();
    });

    this.lessonsService.getLessonById(this.idLesson).subscribe(
      data => {
        this.lesson = data;
      },
      (error) => (
        console.error('Erreur lors de la récupération de la leçon:', error)
      )
    )
  }

  validateLesson(idLesson:number | undefined) {
    this.lessonsService.validateLesson(this.idUser, idLesson).subscribe({
      next: (response) => {
        console.log('Réponse du serveur:', response);
        this.router.navigate(['/lecons']);
      }
    });
  }

  checkLessonCompletion() {
    this.lessonsService.checkLessonCompletion(this.idUser, this.idLesson).subscribe({
      next: (response) => {
        this.isLessonCompleted = true;
        console.log('Leçon complétée:', response);
      },
      error: (error) => {
        if (error.status === 404) {
          this.isLessonCompleted = false;
          console.log('Leçon non complétée');
        } else {
          console.error('Erreur lors de la vérification de la complétion de la leçon:', error);
        }
      }
    });
  }
}
