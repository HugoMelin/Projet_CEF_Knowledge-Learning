import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PurchasesService } from '../../services/purchases/purchases.service';
import { LessonsService } from '../../services/lessons/lessons.service';
import { CoursesService } from '../../services/courses/courses.service';

interface User {
  idUser: number;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
}

interface Course {
  idCourses: number;
  title: string;
  description: string;
  price: number;
  idTheme: number;
}

interface Purchase {
  idPurchase: number;
  idUser: number;
  idCourses: number | null ;
  idLessons: number | null;
  idInvoice: number;
}

interface Lesson {
  idLesson:number;
  title:string;
  content:string;
  videoUrl:string;
  price:number;
  idCourse:number;
}

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [ CommonModule, RouterLink ],
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})
export class CourseComponent implements OnInit {
  logged:boolean = false;
  courseId: number | undefined;
  lessons: any[] = [];
  course: any;
  user: User | null = null;
  userId: number | undefined;

  constructor(
    private authService: AuthService,
    private lessonsService: LessonsService,
    private router: Router,
    private purchaseService: PurchasesService,
    private coursesService: CoursesService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.logged = this.authService.isLoggedIn();

    if (!this.logged) {
      this.router.navigate(['/connexion']);
    }

    this.route.params.subscribe(params => {
      this.courseId = +params['idCours'];
    });

    this.lessonsService.getLessonsByCourseId(this.courseId).subscribe(
      data => (
        this.lessons = data
      ),
      (error:any) => (
        console.error('Erreur lors de la récupération des leçons', error)
      )
    )

    this.coursesService.getCourseById(this.courseId).subscribe(
      data => (
        this.course = data
      ),
      (error) => (
        console.error('Erreur lors de la récupération du cours:', error)
      )
    )

    this.user = this.authService.getUser();
    this.userId = this.user?.idUser;
  }

  canAddToCart(lessonId: number, courseId: number): boolean {
    let canAdd = false;
    this.purchaseService.canAddToCart(this.userId!, courseId, lessonId).subscribe({
      next: (result: boolean) => {
        canAdd = result;
      },
      error: (error) => {
        console.error('Erreur lors de la vérification:', error);
      }
    });
    return canAdd;
  }
}
