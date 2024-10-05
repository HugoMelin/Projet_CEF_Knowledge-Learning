import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environnements/environnements';

interface Theme {
  idThemes: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private apiUrl = `${environment.API_URL}/themes`;

  constructor(private http: HttpClient) { }

  getThemes(): Observable<Theme[]> {
    return this.http.get<Theme[]>(this.apiUrl);
  }
}