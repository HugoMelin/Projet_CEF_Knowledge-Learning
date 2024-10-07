import { Injectable } from '@angular/core';
import { environment } from '../../../environnements/environnements';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

interface User {
  idUser: number;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = `${environment.API_URL}/users`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllUsers(): Observable<User[]> {
    const url = `${this.apiUrl}`;
    const headers = this.getHeaders();
    return this.http.get<User[]>(url, { headers });
  }

  parseRoles(roleString: string): string[] {
    try {
      return JSON.parse(roleString.replace(/'/g, '"'));
    } catch {
      return [];
    }
  }

  isAdmin(user: User): boolean {
    const roles = this.parseRoles(user.role);
    return roles.includes('role-admin');
  }

  updateUserRole(idUser: number, newRoles: string): Observable<any> {
    const url = `${this.apiUrl}/${idUser}`;
    const body = { role: newRoles };
    const headers = this.getHeaders();
    return this.http.patch(url, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Une erreur s\'est produite:', error.error.message);
    } else {
      console.error(
        `L'API a renvoyé le code ${error.status}, ` +
        `le corps était : ${JSON.stringify(error.error)}`);
    }
    return throwError(error.error.error || 'Une erreur s\'est produite, veuillez réessayer plus tard.');
  }

  getUserCount(): Observable<number> {
    return this.getAllUsers().pipe(
      map(users => users.length)
    );
  }
}
