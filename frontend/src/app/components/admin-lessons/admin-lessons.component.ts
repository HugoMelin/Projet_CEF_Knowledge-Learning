import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { LessonsService } from '../../services/lessons/lessons.service';
import { CoursesService } from '../../services/courses/courses.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Lesson {
  idLessons: number;
  title: string;
  content: string;
  videoUrl: string;
  price: number;
  idCourses: number;
}

interface Course {
  idCourses: number;
  title: string;
}

@Component({
  selector: 'app-admin-lessons',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './admin-lessons.component.html',
  styleUrl: './admin-lessons.component.css'
})
export class AdminLessonsComponent implements OnInit{
  lessons: Lesson[] = [];
  courses: Course[] = [];
  currentLesson: Lesson | null = null;
  modalMode: 'add' | 'edit' = 'add';
  lessonTitle: string = '';
  lessonContent: string = '';
  lessonVideoUrl: string = '';
  lessonPrice: number = 0;
  selectedCourseId: number | null = null;
  errorMsg: string = '';
  pagedLessons: Lesson[] = [];
  currentPage: number = 1;
  pageSize: number = 20;
  totalPages: number = 0;

  @ViewChild('lessonModal') lessonModal!: ElementRef;

  constructor(
    private lessonService: LessonsService,
    private courseService: CoursesService,
  ) { }

  ngOnInit(): void {
    this.loadLessons();
    this.loadCourses();
  }

  loadLessons(): void {
    this.lessonService.getAllLessons().subscribe(
      (lessons) => {
        this.lessons = lessons;
        this.totalPages = Math.ceil(this.lessons.length / this.pageSize);
        this.setPage(1);
      },
      (error) => {
        console.error('Erreur lors du chargement des leçons:', error);
      }
    );
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe(
      (courses) => {
        this.courses = courses;
      },
      (error) => {
        console.error('Erreur lors du chargement des cours:', error);
      }
    );
  }

  setPage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    this.pagedLessons = this.lessons.slice(startIndex, startIndex + this.pageSize);
  }

  openAddLessonModal(): void {
    this.modalMode = 'add';
    this.lessonTitle = '';
    this.lessonContent = '';
    this.lessonVideoUrl = '';
    this.lessonPrice = 0;
    this.selectedCourseId = null;
    this.currentLesson = null;
    this.openModal();
  }

  openEditLessonModal(lesson: Lesson): void {
    this.modalMode = 'edit';
    this.lessonTitle = lesson.title;
    this.lessonContent = lesson.content;
    this.lessonVideoUrl = lesson.videoUrl;
    this.lessonPrice = lesson.price;
    this.selectedCourseId = lesson.idCourses;
    this.currentLesson = lesson;
    this.openModal();
  }

  openModal(): void {
    (this.lessonModal.nativeElement as HTMLElement).classList.add('show');
    (this.lessonModal.nativeElement as HTMLElement).style.display = 'block';
  }

  closeModal(): void {
    (this.lessonModal.nativeElement as HTMLElement).classList.remove('show');
    (this.lessonModal.nativeElement as HTMLElement).style.display = 'none';
  }

  saveLesson(): void {
    if (!this.selectedCourseId) {
      this.errorMsg = 'Veuillez sélectionner un cours.';
      return;
    }

    const lessonData: Partial<Lesson> = {
      title: this.lessonTitle,
      content: this.lessonContent,
      videoUrl: this.lessonVideoUrl,
      price: this.lessonPrice,
      idCourses: this.selectedCourseId
    };

    if (this.modalMode === 'add') {
      this.lessonService.addLesson(lessonData as Lesson).subscribe(
        () => {
          this.loadLessons();
          this.closeModal();
        },
        (error: any) => {
          console.error('Erreur lors de l\'ajout de la leçon:', error);
          this.errorMsg = 'Erreur lors de l\'ajout de la leçon.';
        }
      );
    } else if (this.currentLesson) {
      this.lessonService.updateLesson(this.currentLesson.idLessons, lessonData).subscribe(
        () => {
          this.loadLessons();
          this.closeModal();
        },
        (error: any) => {
          console.error('Erreur lors de la modification de la leçon:', error);
          this.errorMsg = 'Erreur lors de la modification de la leçon.';
        }
      );
    }
  }

  deleteLesson(lessonId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette leçon ?')) {
      this.lessonService.deleteLesson(lessonId).subscribe(
        () => {
          this.loadLessons();
        },
        (error: any) => {
          console.error('Erreur lors de la suppression de la leçon:', error);
          this.errorMsg = 'Vous ne pouvez pas supprimer cette leçon.';
        }
      );
    }
  }

  getCourseName(idCourses: number): string {
    const course = this.courses.find(c => c.idCourses === idCourses);
    return course ? course.title : 'Cours inconnu';
  }
}
