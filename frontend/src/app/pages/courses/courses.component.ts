import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CoursesService } from '../../services/courses/courses.service';
import { PurchasesService } from '../../services/purchases/purchases.service';

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

interface User {
  idUser: number;
  username: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [ CommonModule, RouterLink ],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit {
  logged:boolean = false;
  courses:any[] = [];
  user: User | null = null;
  userId: number | undefined;
  pagedCourses: any[] = [];
  currentPage: number = 1;
  pageSize: number = 9;
  totalPages: number = 0;

  constructor(
    private authService: AuthService,
    private courseService: CoursesService,
    private router: Router,
    private purchaseService: PurchasesService
  ) {}

  ngOnInit(): void {

    this.logged = this.authService.isLoggedIn();

    if (!this.logged) {
      this.router.navigate(['/connexion']);
    }

    this.courseService.getAllCourses().subscribe(
      data => {
        this.courses = data;
        this.totalPages = Math.ceil(this.courses.length / this.pageSize);
        this.setPage(1);
      },
      (error) => (
        console.error('Erreur lors de la récupération des cours:', error)
      )
    )

    this.user = this.authService.getUser();
    this.userId = this.user?.idUser;
  }

  canAddToCart(courseId: number): boolean {
    let canAdd = false;
    this.purchaseService.canAddToCart(this.userId!, courseId, null).subscribe({
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
    this.pagedCourses = this.courses.slice(startIndex, startIndex + this.pageSize);
  }
}
