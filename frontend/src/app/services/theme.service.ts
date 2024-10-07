import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { environment } from '../../environnements/environnements';

interface Theme {
  idThemes: number;
  name: string;
}

interface CompletedCertification {
  idUser: number;
  idThemes: number;
  idCertifications: number;
  obtainedDate: string;
  themeTitle?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private apiUrl = `${environment.API_URL}/themes`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getThemes(): Observable<Theme[]> {
    return this.http.get<Theme[]>(this.apiUrl);
  }

  getThemeById(themeId: number | undefined): Observable<Theme> {
    return this.http.get<Theme>(`${this.apiUrl}/${themeId}`);
  }
  
  getValidatedCertifications(userId?: number): Observable<CompletedCertification[]> {
    const headers = this.getHeaders();
    return this.http.get<CompletedCertification[]>(`${environment.API_URL}/certifications/${userId}`, { headers }).pipe(
      mergeMap(completedCertifications => {
        const certificationRequests = completedCertifications.map(cert => 
          this.getCertificationTheme(cert.idThemes)
        );
        return forkJoin(certificationRequests).pipe(
          map(themes => {
            return completedCertifications.map((cert, index) => ({
              ...cert,
              themeTitle: themes[index] || 'Inconnu'
            }));
          })
        );
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404 && error.error?.message === "Aucune certification trouvée pour cet utilisateur") {
          // Si c'est une erreur 404 avec le message spécifique, on retourne un tableau vide
          return of([]);
        }
        // Pour les autres erreurs, on les log et on retourne un tableau vide
        console.error('Erreur lors de la récupération des certifications:', error);
        return of([]);
      })
    );
  }

  private getCertificationTheme(idThemes: number): Observable<string> {
    return this.getThemeById(idThemes).pipe(
      map(response => response.name),
      catchError(() => {
        return of('Inconnu');
      })
    );
  }
}