import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environnements/environnements';
import { Observable } from 'rxjs';

interface Lesson {
  idLesson:number;
  title:string;
  content:string;
  videoUrl:string;
  price:number;
  idCourse:number;
}

@Injectable({
  providedIn: 'root'
})
export class LessonsService {
  private apiUrl = `${environment.API_URL}/lessons`;

  constructor(
    private http: HttpClient
  ) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getLessonsByCourseId(courseId:number | undefined): Observable<Lesson[]>{
    const headers = this.getHeaders();
    return this.http.get<Lesson[]>(`${this.apiUrl}/course/${courseId}`, { headers })
  }
}
