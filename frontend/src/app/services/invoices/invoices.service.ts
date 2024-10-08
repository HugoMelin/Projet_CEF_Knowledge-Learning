// invoice.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environnements/environnements';

export interface Invoice {
  idInvoice: number;
  idUser: number;
  price: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = `${environment.API_URL}/invoices`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  getAllInvoices(): Observable<Invoice[]> {
    const url = `${this.apiUrl}`;
    const headers = this.getHeaders();
    return this.http.get<Invoice[]>(url, { headers });
  }

  getUserInvoices(userId: number): Observable<Invoice[]> {
    const headers = this.getHeaders();
    return this.http.get<Invoice[]>(`${this.apiUrl}/user/${userId}`, { headers });
  }

  getTotalInvoiceAmount(): Observable<number> {
    return this.getAllInvoices().pipe(
      map(invoices => invoices.reduce((total, invoice) => total + parseFloat(invoice.price), 0))
    );
  }

  getInvoiceCount(): Observable<number> {
    return this.getAllInvoices().pipe(
      map(invoices => invoices.length)
    );
  }
}