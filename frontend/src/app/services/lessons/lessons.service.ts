import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environnements/environnements';
import { forkJoin, map, mergeMap, Observable } from 'rxjs';
import { CoursesService } from '../courses/courses.service';

interface Lesson {
  idLessons:number;
  title:string;
  content:string;
  videoUrl:string;
  price:number;
  idCourses:number;
}

interface CompletedLesson {
  idUser:number;
  idLessons:number;
  completedDate:string;
  lessonTitle?: string;
  courseTitle?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LessonsService {
  private apiUrl = `${environment.API_URL}/lessons`;

  constructor(
    private http: HttpClient,
    private courseService: CoursesService
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

  getValidatedLessons(userId?: number): Observable<CompletedLesson[]> {
    const headers = this.getHeaders();
    return this.http.get<CompletedLesson[]>(`${environment.API_URL}/completed_lessons/${userId}`, { headers }).pipe(
      mergeMap(completedLessons => {
        const lessonRequests = completedLessons.map(lesson => 
          this.getLessonDetailsWithCourse(lesson.idLessons)
        );
        return forkJoin(lessonRequests).pipe(
          map(lessonDetails => {
            return completedLessons.map((lesson, index) => ({
              ...lesson,
              lessonTitle: lessonDetails[index].lessonTitle,
              courseTitle: lessonDetails[index].courseTitle
            }));
          })
        );
      })
    );
  }

  private getLessonDetailsWithCourse(lessonId: number): Observable<{ lessonTitle: string, courseTitle: string }> {
    return this.getLessonById(lessonId).pipe(
      mergeMap(lessonDetails => 
        this.courseService.getCourseById(lessonDetails.idCourses).pipe(
          map(courseDetails => ({
            lessonTitle: lessonDetails.title,
            courseTitle: courseDetails.title,
          }))
        )
      )
    );
  }

  addLesson(lessonData: Omit<Lesson, 'idLessons'>): Observable<Lesson> {
    const url = `${this.apiUrl}`;
    const body = lessonData;
    const headers = this.getHeaders();
    return this.http.post<Lesson>(url, body, { headers });
  }

  updateLesson(idLesson: number, lessonData: Partial<Lesson>): Observable<Lesson> {
    const url = `${this.apiUrl}/${idLesson}`;
    const body = lessonData;
    const headers = this.getHeaders();
    return this.http.patch<Lesson>(url, body, { headers });
  }

  deleteLesson(idLesson: number): Observable<any> {
    const url = `${this.apiUrl}/${idLesson}`;
    const headers = this.getHeaders();
    return this.http.delete(url, { headers });
  }
}

