import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_BASE_URL, HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends HttpService {

  readonly tokenSource$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    http: HttpClient,
    @Inject(API_BASE_URL) baseUrl: string
  ) {
    super(http, baseUrl);
  }

  setToken(token: string): void {
    this.tokenSource$.next(token);
  }

  getAuthToken(payload: Payload): Observable<AuthResponse> {
    return this.post('authenticate', payload);
  }
}

export interface AuthResponse {
  id_token: string;
}

export interface Payload {
  username: string;
  stationId: string;
  password: string;
  rememberMe: boolean;
}
