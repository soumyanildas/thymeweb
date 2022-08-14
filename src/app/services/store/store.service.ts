import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Department } from 'src/app/models/Department';
import { Item } from 'src/app/models/Item';
import { Store } from 'src/app/models/Store';
import { API_BASE_URL, HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService extends HttpService {

  readonly shopLocationSource$: BehaviorSubject<Store[]> = new BehaviorSubject<Store[]>([]);

  constructor(
    http: HttpClient,
    @Inject(API_BASE_URL) baseUrl: string
  ) {
    super(http, baseUrl);
  }

  getStores(): Observable<Store[]> {
    return this.get('store-locals');
  }

  getStore(companyId: string): Observable<Store> {
    return this.get('store-locals/' + companyId);
  }

  getDepartments(storeId: string): Observable<Department[]> {
    return this.get('depts/storeId/' + storeId);
  }

  getItems(storeId: string): Observable<Item[]> {
    return this.get('onlinedeliveries/webitems/' + storeId);
  }

}
