import { Injectable } from '@angular/core';
import { environment } from '../../../environnements/environnements';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

interface Purchase {
  idPurchase: number;
  idUser: number;
  idCourses: number | null;
  idLessons: number | null;
  idInvoice: number;
}

@Injectable({
  providedIn: 'root'
})
export class PurchasesService {
  private apiUrl = `${environment.API_URL}/purchases`;
  private userPurchasesCache: { [userId: number]: Observable<Purchase[]> } = {};

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
  ) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getUserPurchases(userId: number): Observable<Purchase[]> {
    if (!this.authService.isVerified()) {
      const errorMessage = 'Votre compte n\'a pas été vérifié.';
      this.router.navigate(['/'], { queryParams: { error: errorMessage } });
      return of([])
    }

    if (!this.userPurchasesCache[userId]) {
      const headers = this.getHeaders();
      this.userPurchasesCache[userId] = this.http.get<Purchase[]>(`${this.apiUrl}/user/${userId}`, { headers }).pipe(
        shareReplay(1),
        catchError(error => {
          console.error('Erreur lors de la récupération des achats:', error);
          return of([]);
        })
      );
    }
    return this.userPurchasesCache[userId];
  }

  canAddToCart(userId: number, courseId: number | null, lessonId: number | null): Observable<boolean> {
    if (!this.authService.isVerified()) {
      return of(false);
    }
    return this.getUserPurchases(userId).pipe(
      map(purchases => {

        if (courseId && lessonId) {
          const hasPurchasedCourse = purchases.some(p => p.idCourses === courseId);
          
          const hasPurchasedLesson = purchases.some(p => p.idLessons === lessonId);
          
          return !(hasPurchasedCourse || hasPurchasedLesson);
        } else {
          const hasPurchasedCourse = !purchases.some(p => p.idCourses === courseId);
          
          const hasPurchasedLesson = !purchases.some(p => p.idLessons === lessonId);
          
          return (hasPurchasedCourse || hasPurchasedLesson);
        }
      })
    );
  }

  clearCache(userId?: number) {
    if (userId) {
      delete this.userPurchasesCache[userId];
    } else {
      this.userPurchasesCache = {};
    }
  }
}