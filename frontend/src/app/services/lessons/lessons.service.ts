import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environnements/environnements';
import { Observable } from 'rxjs';

interface Lesson {
  idLessons:number;
  title:string;
  content:string;
  videoUrl:string;
  price:number;
  idCourses:number;
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

  getAllLessons(): Observable<Lesson[]> {
    const headers = this.getHeaders();
    return this.http.get<Lesson[]>(this.apiUrl, { headers });
  }

  getLessonById(idLesson:number | undefined): Observable<Lesson> {
    const headers = this.getHeaders();
    return this.http.get<Lesson>(`${this.apiUrl}/${idLesson}`, { headers });
  }

  getLessonsByCourseId(courseId:number | undefined): Observable<Lesson[]>{
    const headers = this.getHeaders();
    return this.http.get<Lesson[]>(`${this.apiUrl}/course/${courseId}`, { headers })
  }

  validateLesson(idUser:number | undefined, idLesson:number | undefined): Observable<Lesson[]>{
    const headers = this.getHeaders();
    return this.http.post<Lesson[]>(`${environment.API_URL}/completed_lessons/`, {idUser: idUser, idLessons: idLesson},{ headers })
  }

  checkLessonCompletion(userId: number | undefined, lessonId: number | undefined): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${environment.API_URL}/completed_lessons/${userId}/${lessonId}`, { headers });
  }
}
