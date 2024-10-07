import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users/users.service';
import { InvoiceService } from '../../services/invoices/invoices.service';
import { CoursesService } from '../../services/courses/courses.service';
import { LessonsService } from '../../services/lessons/lessons.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent implements OnInit {
    userCount: number = 0;
    invoiceCount: number = 0;
    totalInvoiceAmount: number = 0;
    courseCount: number = 0;
    lessonCount: number = 0;
  
    constructor(
      private userService: UsersService,
      private invoiceService: InvoiceService,
      private courseService: CoursesService,
      private lessonService: LessonsService
    ) {}
  
    ngOnInit(): void {
      this.loadStatistics();
    }
  
    loadStatistics(): void {
      this.userService.getUserCount().subscribe(count => this.userCount = count);
      this.invoiceService.getInvoiceCount().subscribe(count => this.invoiceCount = count);
      this.invoiceService.getTotalInvoiceAmount().subscribe(total => this.totalInvoiceAmount = total);
      this.courseService.getCourseCount().subscribe(count => this.courseCount = count);
      this.lessonService.getLessonCount().subscribe(count => this.lessonCount = count);
    }
}
