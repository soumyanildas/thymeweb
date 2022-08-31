import { Component, OnInit } from '@angular/core';
import { Store } from '../../models/Store';
import { StoreService } from '../../services/store/store.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  stores: Store[] = [];

  constructor(
    private storeService: StoreService
  ) { }

  ngOnInit(): void {
    this._getStores();
  }

  private _getStores(): void {
    this.storeService.getStores()
      .subscribe((response: Store[]) => {
        console.log('🚀 ~ file: home.component.ts ~ line 25 ~ HomeComponent ~ .subscribe ~ response', response);
        this.stores = response;
      });
  }

}
