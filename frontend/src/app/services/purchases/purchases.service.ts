import { Injectable, resolveForwardRef } from '@angular/core';
import { environment } from '../../../environnements/environnements';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { forkJoin } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

interface Purchase {
  idPurchases: number;
  idUser: number;
  idCourses: number | null;
  idLessons: number | null;
  idInvoice: number;
  title: string;
  type: 'course' | 'lesson';
  purchaseDate: string;
}

interface Invoice {
  idInvoice: number;
  idUser: number;
  price: string;
  created_at: string;
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
      return of([]);
    }
  
    if (!this.userPurchasesCache[userId]) {
      const headers = this.getHeaders();
      this.userPurchasesCache[userId] = this.http.get<Purchase[]>(`${this.apiUrl}/user/${userId}`, { headers }).pipe(
        map(response => response as Purchase[]),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404 && error.error?.message === "Aucun achat trouvé pour cet utilisateur") {
            return of([]);
          }
          console.error('Erreur lors de la récupération des achats:', error);
          return of([]);
        }),
        shareReplay(1)
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

  getUserPurchasesWithDetails(userId: number): Observable<Purchase[]> {
    return this.getUserPurchases(userId).pipe(
      mergeMap(purchases => {
        const detailRequests = purchases.map(purchase => {
          if (purchase.idCourses) {
            return this.getCourseDetails(purchase.idCourses).pipe(
              map(course => ({
                ...purchase,
                title: course.title,
                type: 'course' as const
              }))
            );
          } else if (purchase.idLessons) {
            return this.getLessonDetails(purchase.idLessons).pipe(
              map(lesson => ({
                ...purchase,
                title: lesson.title,
                type: 'lesson' as const
              }))
            );
          }
          return of(purchase);
        });
  
        return forkJoin(detailRequests).pipe(
          mergeMap(detailedPurchases => this.getInvoiceDates(detailedPurchases))
        );
      })
    );
  }
  
  private getCourseDetails(courseId: number): Observable<{title: string}> {
    const headers = this.getHeaders();
    return this.http.get<{title: string}>(`${environment.API_URL}/courses/${courseId}`, { headers });
  }
  
  private getLessonDetails(lessonId: number): Observable<{title: string}> {
    const headers = this.getHeaders();
    return this.http.get<{title: string}>(`${environment.API_URL}/lessons/${lessonId}`, { headers });
  }
  
  private getInvoiceDates(purchases: Purchase[]): Observable<Purchase[]> {
    const headers = this.getHeaders();
    const userId = purchases[0]?.idUser;
    
    if (!userId) {
      return of(purchases);
    }
  
    return this.http.get<Invoice[]>(`${environment.API_URL}/invoices/user/${userId}`, { headers }).pipe(
      map(invoices => {
        const invoiceDateMap = invoices.reduce((acc, inv) => {
          acc[inv.idInvoice] = inv.created_at;
          return acc;
        }, {} as {[key: number]: string});
  
        return purchases.map(purchase => ({
          ...purchase,
          purchaseDate: invoiceDateMap[purchase.idInvoice]
        }));
      })
    );
  }
}