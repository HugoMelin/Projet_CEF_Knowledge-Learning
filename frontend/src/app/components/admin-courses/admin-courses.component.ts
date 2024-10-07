import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CoursesService } from '../../services/courses/courses.service';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Course {
  idCourses: number;
  title: string;
  description: string;
  price: number;
  idThemes: number;
}

interface Theme {
  idThemes: number;
  name: string;
}

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './admin-courses.component.html',
  styleUrl: './admin-courses.component.css'
})
export class AdminCoursesComponent implements OnInit {
  courses: Course[] = [];
  themes: Theme[] = [];
  currentCourse: Course | null = null;
  modalMode: 'add' | 'edit' = 'add';
  courseTitle: string = '';
  courseDescription: string = '';
  coursePrice: number = 0;
  selectedThemeId: number | null = null;
  errorMsg: string = '';
  pagedCourses: Course[] = [];
  currentPage: number = 1;
  pageSize: number = 20;
  totalPages: number = 0;

  @ViewChild('courseModal') courseModal!: ElementRef;

  constructor(
    private courseService: CoursesService,
    private themeService: ThemeService,
  ) { }

  ngOnInit(): void {
    this.loadCourses();
    this.loadThemes();
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe(
      (courses) => {
        this.courses = courses;
        this.totalPages = Math.ceil(this.courses.length / this.pageSize);
        this.setPage(1);
      },
      (error) => {
        console.error('Erreur lors du chargement des cours:', error);
      }
    );
  }

  loadThemes(): void {
    this.themeService.getThemes().subscribe(
      (themes) => {
        this.themes = themes;
      },
      (error) => {
        console.error('Erreur lors du chargement des thèmes:', error);
      }
    );
  }

  setPage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    this.pagedCourses = this.courses.slice(startIndex, startIndex + this.pageSize);
  }

  openAddCourseModal(): void {
    this.modalMode = 'add';
    this.courseTitle = '';
    this.courseDescription = '';
    this.coursePrice = 0;
    this.selectedThemeId = null;
    this.currentCourse = null;
    this.openModal();
  }

  openEditCourseModal(course: Course): void {
    this.modalMode = 'edit';
    this.courseTitle = course.title;
    this.courseDescription = course.description;
    this.coursePrice = course.price;
    this.selectedThemeId = course.idThemes;
    this.currentCourse = course;
    this.openModal();
  }

  openModal(): void {
    (this.courseModal.nativeElement as HTMLElement).classList.add('show');
    (this.courseModal.nativeElement as HTMLElement).style.display = 'block';
  }

  closeModal(): void {
    (this.courseModal.nativeElement as HTMLElement).classList.remove('show');
    (this.courseModal.nativeElement as HTMLElement).style.display = 'none';
  }

  saveCourse(): void {
    if (!this.selectedThemeId) {
      this.errorMsg = 'Veuillez sélectionner un thème.';
      return;
    }

    const courseData: Partial<Course> = {
      title: this.courseTitle,
      description: this.courseDescription,
      price: this.coursePrice,
      idThemes: this.selectedThemeId
    };

    if (this.modalMode === 'add') {
      this.courseService.addCourse(courseData as Course).subscribe(
        () => {
          this.loadCourses();
          this.closeModal();
        },
        (error: any) => {
          console.error('Erreur lors de l\'ajout du cours:', error);
          this.errorMsg = 'Erreur lors de l\'ajout du cours.';
        }
      );
    } else if (this.currentCourse) {
      this.courseService.updateCourse(this.currentCourse.idCourses, courseData).subscribe(
        () => {
          this.loadCourses();
          this.closeModal();
        },
        (error: any) => {
          console.error('Erreur lors de la modification du cours:', error);
          this.errorMsg = 'Erreur lors de la modification du cours.';
        }
      );
    }
  }

  deleteCourse(courseId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      this.courseService.deleteCourse(courseId).subscribe(
        () => {
          this.loadCourses();
        },
        (error: any) => {
          console.error('Erreur lors de la suppression du cours:', error);
          this.errorMsg = 'Vous ne pouvez pas supprimer ce cours.';
        }
      );
    }
  }

  getThemeName(idThemes: number): string {
    const theme = this.themes.find(t => t.idThemes === idThemes);
    return theme ? theme.name : 'Thème inconnu';
  }
}