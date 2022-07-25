import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { API_BASE_URL, HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends HttpService {

  public readonly tokenSource$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    http: HttpClient,
    @Inject(API_BASE_URL) baseUrl: string
  ) { 
    super(http, baseUrl);
  }

}
