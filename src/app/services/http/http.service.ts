import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) private readonly baseUrl: string
  ) { }

  get(endPoint: string): Observable<any> {
    return this.http.get(this.baseUrl + endPoint);
  }

  post(endPoint: string, body: any): Observable<any> {
    return this.http.post(this.baseUrl + endPoint, body);
  }

  put(endPoint: string, body: any): Observable<any> {
    return this.http.put(this.baseUrl + endPoint, body);
  }

  delete(endPoint: string): Observable<any> {
    return this.http.delete(this.baseUrl + endPoint);
  }

}

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');