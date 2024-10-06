import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LessonsService } from '../../services/lessons/lessons.service';
import { AuthService } from '../../services/auth.service';
import { PurchasesService } from '../../services/purchases/purchases.service';

interface Lesson {
  idLesson:number;
  title:string;
  content:string;
  videoUrl:string;
  price:number;
  idCourse:number;
}

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

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [ CommonModule, RouterLink ],
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.css'
})
export class LessonsComponent implements OnInit {
  logged:boolean = false;
  lessons:any[] = [];
  user: User | null = null;
  userId: number | undefined;

  pagedLessons: any[] = [];
  currentPage: number = 1;
  pageSize: number = 9;
  totalPages: number = 0;

  constructor(
    private authService: AuthService,
    private lessonsService: LessonsService,
    private router: Router,
    private purchaseService: PurchasesService,
  ) {}

  ngOnInit() {
    this.logged = this.authService.isLoggedIn();

    if (!this.logged) {
      this.router.navigate(['/connexion']);
    }

    this.lessonsService.getAllLessons().subscribe(
      data => {
        this.lessons = data;
        this.totalPages = Math.ceil(this.lessons.length / this.pageSize);
        this.setPage(1);
      },
      (error) => (
        console.error('Erreur lors de la récupération des leçons:', error)
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

  setPage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    this.pagedLessons = this.lessons.slice(startIndex, startIndex + this.pageSize);
  }
}
