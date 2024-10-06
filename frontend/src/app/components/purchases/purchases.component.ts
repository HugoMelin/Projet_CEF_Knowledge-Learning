import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PurchasesService } from '../../services/purchases/purchases.service';
import { CommonModule } from '@angular/common';

export interface Purchase {
  idPurchases: number;
  idUser: number;
  idCourses: number | null;
  idLessons: number | null;
  idInvoice: number;
  title: string;
  type: 'course' | 'lesson';
  purchaseDate: string;
}


@Component({
  selector: 'app-purchases',
  standalone: true,
  imports : [ CommonModule ],
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.css']
})
export class PurchasesComponent implements OnInit {
  purchases: Purchase[] = [];

  constructor(
    private purchasesService: PurchasesService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    const userId = this.authService.getUser()?.idUser;
    if (userId) {
      this.loadPurchases(userId);
    }
  }

  loadPurchases(userId: number): void {
    this.purchasesService.getUserPurchasesWithDetails(userId).subscribe(
      purchases => {
        this.purchases = purchases;
      },
      error => {
        console.error('Erreur lors du chargement des achats:', error);
      }
    );
  }
}