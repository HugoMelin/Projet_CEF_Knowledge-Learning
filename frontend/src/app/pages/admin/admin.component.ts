import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminThemeComponent } from '../../components/admin-theme/admin-theme.component';
import { AdminCoursesComponent } from '../../components/admin-courses/admin-courses.component';
import { AdminLessonsComponent } from '../../components/admin-lessons/admin-lessons.component';
import { AdminUsersComponent } from '../../components/admin-users/admin-users.component';
import { AdminInvoicesComponent } from '../../components/admin-invoices/admin-invoices.component';
import { AdminHomeComponent } from '../../components/admin-home/admin-home.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ CommonModule, AdminThemeComponent, AdminCoursesComponent, AdminLessonsComponent, AdminUsersComponent, AdminInvoicesComponent, AdminHomeComponent ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  logged:boolean = false;
  currentComponent:string = 'home'

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.logged = this.authService.getUSerRole() === 'admin';

    if (!this.logged) {
      this.router.navigate(['/connexion']);
    }

  }

  showComponent(component: string) {
    this.currentComponent = component;
  }
}
