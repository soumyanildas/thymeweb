import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Payment } from 'src/app/models/Payment';
import { API_BASE_URL, HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService extends HttpService {

  payment$ = new BehaviorSubject<any>(null);

  constructor(
    http: HttpClient,
    @Inject(API_BASE_URL) baseUrl: string
  ) {
    super(http, baseUrl);
  }

  submitInvoice(payment: Payment): Observable<any> {
    return this.post('web-invoice', payment);
  }

  setPayment(payment: any): void {
    this.payment$.next(payment);
  }

  getPayment(): Observable<any> {
    return this.payment$.asObservable();
  }

}
