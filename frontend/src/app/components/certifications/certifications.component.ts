import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';

interface CompletedCertification {
  idUser: number;
  idCertifications: number;
  obtainedDate: string;
  themeTitle?: string;
}

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './certifications.component.html',
  styleUrl: './certifications.component.css'
})
export class CertificationsComponent implements OnInit {
    validatedCertifications: CompletedCertification[] = [];
    userId: number | undefined;
  
    constructor(
      private authService: AuthService,
      private themeService: ThemeService
    ) { }
  
    ngOnInit(): void {
      this.userId = this.authService.getUser()?.idUser;

      this.loadValidatedCertifications();
    }
  
    loadValidatedCertifications(): void {
      const userId = this.userId
      this.themeService.getValidatedCertifications(userId).subscribe(
        certifications => {
          this.validatedCertifications = certifications;
        },
        error => {
          console.error('Erreur lors de la récupération des certifications validées', error);
        }
      );
    }
  }
