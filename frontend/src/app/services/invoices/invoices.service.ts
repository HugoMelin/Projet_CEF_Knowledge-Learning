// invoice.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  getUserInvoices(userId: number): Observable<Invoice[]> {
    const headers = this.getHeaders();
    return this.http.get<Invoice[]>(`${this.apiUrl}/user/${userId}`, { headers });
  }
}