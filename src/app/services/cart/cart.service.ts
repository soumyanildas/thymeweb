import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from 'src/app/models/Cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartSource$: BehaviorSubject<Cart> = new BehaviorSubject<Cart>(
    {
      store: {},
      items: []
    }
  );

  constructor() {
    this.init();
  }

  private init() {
    if (localStorage.getItem('cart')) {
      const cart: Cart = JSON.parse(localStorage.getItem('cart') || '{}')
      this.cartSource$ = new BehaviorSubject<Cart>(cart);
    } else {
      const cart: Cart = {
        store: {},
        items: []
      };
      this.cartSource$ = new BehaviorSubject<Cart>(cart);
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }

  viewCart(): Observable<Cart> {
    return this.cartSource$.asObservable();
  }

  updateCart(cart: Cart): void {
    this.cartSource$.next(cart);
    this.persistCart(cart);
  }

  emptyCart(): void {
    this.cartSource$.next({
      store: {},
      items: []
    });
    this.persistCart({
      store: {},
      items: []
    });
  }

  private persistCart(cart: Cart): void {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

}
