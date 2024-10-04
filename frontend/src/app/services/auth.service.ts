import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environnements/environnements';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || '{}'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.API_URL}/users/authenticate`, { email, password })
      .pipe(map(user => {
        // stores user details and JWT token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout() {
    // supprime l'utilisateur du stockage local pour le déconnecter
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  register(user: any): Observable<any> {
    return this.http.post(`${environment.API_URL}/auth/register`, user);
  }

  // Méthode pour vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  // Méthode pour obtenir le token JWT
  getToken(): string | null {
    return this.currentUserValue ? this.currentUserValue.token : null;
  }

  // Méthode pour rafraîchir le token (si votre API le supporte)
  refreshToken(): Observable<any> {
    return this.http.post<any>(`${environment.API_URL}/auth/refresh-token`, {
      'refreshToken': this.currentUserValue.refreshToken
    }).pipe(map((user) => {
      if (user && user.token) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      }
      return user;
    }));
  }
}