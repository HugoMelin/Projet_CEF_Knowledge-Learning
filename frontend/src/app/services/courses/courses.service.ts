import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environnements/environnements';
import { Observable, forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ThemeService } from '../theme.service';

interface Course {
  idCourses: number;
  title: string;
  description: string;
  price: number;
  idThemes: number;
}

interface CompletedCourse {
  idUser: number;
  idCourses: number;
  completedDate: string;
  courseTitle?: string;
  themeTitle?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private apiUrl = `${environment.API_URL}/courses`;

  constructor(
    private http: HttpClient,
    private themeService: ThemeService,
  ) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl)
  }

  getCourseById(courseId:number | undefined): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${courseId}`);
  }

  getCoursesByThemeId(themeId:number | undefined): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/theme/${themeId}`)
  }

  getValidatedCourses(userId?: number): Observable<CompletedCourse[]> {
    const headers = this.getHeaders();
    return this.http.get<CompletedCourse[]>(`${environment.API_URL}/completed_courses/${userId}`, { headers }).pipe(
      mergeMap(completedCourses => {
        const courseRequests = completedCourses.map(course => 
          this.getCourseDetailsWithTheme(course.idCourses)
        );
        return forkJoin(courseRequests).pipe(
          map(courseDetails => {
            return completedCourses.map((course, index) => ({
              ...course,
              courseTitle: courseDetails[index].courseTitle,
              themeTitle: courseDetails[index].themeTitle
            }));
          })
        );
      })
    );
  }

  private getCourseDetailsWithTheme(courseId: number): Observable<{ courseTitle: string, themeTitle: string }> {
    return this.getCourseById(courseId).pipe(
      mergeMap(courseDetails => 
        this.themeService.getThemeById(courseDetails.idThemes).pipe(
          map(themeDetails => ({
            courseTitle: courseDetails.title,
            themeTitle: themeDetails.name,
          }))
        )
      )
    );
  }

  addCourse(courseData: any): Observable<any> {
    const url = `${this.apiUrl}`
    const body = courseData
    const headers = this.getHeaders();
    return this.http.post(url, body, { headers });
  }

  deleteCourse(courseId: number): Observable<any> {
    const url = `${this.apiUrl}/${courseId}`;
    const headers = this.getHeaders();
    return this.http.delete(url, { headers });
  }

  updateCourse(courseId: number, courseData: any): Observable<any> {
    const url = `${this.apiUrl}/${courseId}`;
    const body = courseData;
    const headers = this.getHeaders();
    return this.http.patch(url, body, { headers });
  }

  getCourseCount(): Observable<number> {
    return this.getAllCourses().pipe(
      map(courses => courses.length)
    );
  }
}
