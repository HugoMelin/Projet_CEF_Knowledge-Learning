import { Component, OnInit } from '@angular/core';
import { InvoiceService, Invoice } from '../../services/invoices/invoices.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports : [ CommonModule ],
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {
  invoices: Invoice[] = [];

  constructor(
    private invoiceService: InvoiceService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const userId = this.authService.getUser()?.idUser;
    if (userId) {
      this.loadInvoices(userId);
    }
  }

  loadInvoices(userId: number): void {
    this.invoiceService.getUserInvoices(userId).subscribe(
      invoices => {
        this.invoices = invoices;
      },
      error => {
        console.error('Erreur lors du chargement des factures:', error);
      }
    );
  }
}