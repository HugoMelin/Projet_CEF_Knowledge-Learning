import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ValidatedLessonsComponent } from '../../components/validated-lessons/validated-lessons.component';
import { ValidatedCoursesComponent } from '../../components/validated-courses/validated-courses.component';
import { CertificationsComponent } from '../../components/certifications/certifications.component';

interface User {
  idUser: number;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
}

@Component({
  selector: 'app-compte',
  standalone: true,
  imports: [ CommonModule, ValidatedLessonsComponent, ValidatedCoursesComponent, CertificationsComponent ],
  templateUrl: './compte.component.html',
  styleUrl: './compte.component.css'
})
export class CompteComponent implements OnInit {
  logged:boolean = false;
  user:User | null = null;
  currentComponent:string = 'profile'

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.logged = this.authService.isLoggedIn();

    if (!this.logged) {
      this.router.navigate(['/connexion']);
    }

    this.user = this.authService.getUser();
  }

  showComponent(component: string) {
    this.currentComponent = component;
  }

  checkAdmin() {
    return this.user?.role.includes('role-admin')
  }
}
