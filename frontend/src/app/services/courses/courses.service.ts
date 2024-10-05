import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environnements/environnements';
import { Observable } from 'rxjs';

interface Course {
  idCourses: number;
  title: string;
  description: string;
  price: number;
  idTheme: number;
}

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private apiUrl = `${environment.API_URL}/courses`;

  constructor(
    private http: HttpClient
  ) { }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl)
  }

  getCoursesByThemeId(themeId:number | undefined): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/theme/${themeId}`)
  }
}
