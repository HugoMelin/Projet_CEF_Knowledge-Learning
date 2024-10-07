import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoices/invoices.service';
import { UsersService } from '../../services/users/users.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Invoice {
  idInvoice: number;
  idUser: number;
  price: string;
  created_at: string;
}

interface User {
  idUser: number;
  username: string;
  email: string;
}

interface InvoiceDisplay {
  idInvoice: number;
  username: string;
  email: string;
  price: string;
  created_at: string;
}

@Component({
  selector: 'app-admin-invoices',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './admin-invoices.component.html',
  styleUrl: './admin-invoices.component.css'
})
export class AdminInvoicesComponent implements OnInit {
  invoices: InvoiceDisplay[] = [];
  pagedInvoices: InvoiceDisplay[] = [];
  currentPage: number = 1;
  pageSize: number = 20;
  totalPages: number = 0;
  errorMsg: string = '';
  totalAmount: number = 0;

  constructor(
    private invoiceService: InvoiceService,
    private userService: UsersService,
  ) { }

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.invoiceService.getAllInvoices().subscribe(
      (invoices: Invoice[]) => {
        this.userService.getAllUsers().subscribe(
          (users: User[]) => {
            this.invoices = invoices.map(invoice => {
              const user = users.find(u => u.idUser === invoice.idUser);
              return {
                idInvoice: invoice.idInvoice,
                username: user ? user.username : 'Utilisateur inconnu',
                email: user ? user.email : 'Email inconnu',
                price: invoice.price,
                created_at: invoice.created_at
              };
            });
            this.totalPages = Math.ceil(this.invoices.length / this.pageSize);
            this.setPage(1);
            this.calculateTotalAmount()
          },
          (error) => {
            console.error('Erreur lors du chargement des utilisateurs:', error);
            this.errorMsg = 'Erreur lors du chargement des utilisateurs.';
          }
        );
      },
      (error) => {
        console.error('Erreur lors du chargement des factures:', error);
        this.errorMsg = 'Erreur lors du chargement des factures.';
      }
    );
  }

  setPage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    this.pagedInvoices = this.invoices.slice(startIndex, startIndex + this.pageSize);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  calculateTotalAmount(): void {
    this.totalAmount = this.invoices.reduce((total, invoice) => {
      const price = parseFloat(invoice.price);
      return total + (isNaN(price) ? 0 : price);
    }, 0);
  }
}