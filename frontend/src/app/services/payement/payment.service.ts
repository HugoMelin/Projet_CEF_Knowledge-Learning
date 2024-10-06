import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CartService } from '../cart/cart.service';
import { Observable, Subscription, from } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environnements/environnements';


interface CartItem {
  name: string;
  quantity: number;
  price: number;
  type: string;
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.API_URL}/create-checkout-session`;
  items:CartItem[] = [];
  private cartSubscription: Subscription | undefined;

  constructor(
    private http: HttpClient,
    private cartService: CartService,
  ) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  createCheckoutSession(): Observable<string> {
    return this.cartService.getItems().pipe(
      map(items => items.map(item => ({
        name: item.name,
        price: Math.round(item.price),
        quantity: item.quantity,
        type: item.type,
        id: item.id
      }))),
      switchMap(mappedItems => {
        const headers = this.getHeaders();
        return this.http.post<any>(`${this.apiUrl}`, {items: mappedItems}, { headers });
      }),
      switchMap(response => {
        return from(Promise.resolve(response));
      }),
      map(resolvedResponse => {
        console.log('Réponse résolue:', resolvedResponse);
        const checkoutUrl = resolvedResponse?.url || resolvedResponse?.__zone_symbol__value?.url;
        if (!checkoutUrl) {
          throw new Error('URL de paiement non trouvée dans la réponse');
        }
        return checkoutUrl;
      }),
      tap(url => console.log('URL de paiement extraite:', url))
    );
  }
}