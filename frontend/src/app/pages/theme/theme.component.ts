import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CoursesService } from '../../services/courses/courses.service';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { PurchasesService } from '../../services/purchases/purchases.service';
import { CartService } from '../../services/cart/cart.service';

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

interface User {
  idUser: number;
  username: string;
  email: string;
  role: string;
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
  lessons: any[] = [];
  theme: any;
  user: User | null = null;
  userId: number | undefined;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private coursesService : CoursesService,
    private themeService : ThemeService,
    private purchaseService: PurchasesService,
    private cartService: CartService,
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

  addToCart(event: Event, course: Course) {
    event.preventDefault();
    const product = {
      id: course.idCourses,
      name: course.title,
      price: course.price,
      quantity: 1,
      type: 'course'
    }

    this.cartService.addToCart(product);
    console.log('Produit ajouté au panier', product);
  }
}
