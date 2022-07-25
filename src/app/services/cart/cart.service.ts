import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from 'src/app/models/Cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartSource$: BehaviorSubject<Cart[]> = new BehaviorSubject<Cart[]>([]);

  constructor() {
    this.init();
  }

  private init() {
    if (localStorage.getItem('cart')) {
      const cart: Cart[] = JSON.parse(localStorage.getItem('cart') || '[]')
      this.cartSource$ = new BehaviorSubject<any>(cart);
    } else {
      const cart: Cart[]= [];
      this.cartSource$ = new BehaviorSubject<any>(cart);
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }

  viewCart(): Observable<Cart[]> {
    return this.cartSource$.asObservable();
  }

  updateCart(cart: Cart[]): void {
    this.cartSource$.next(cart);
    this.persistCart(cart);
  }

  emptyCart(): void {
    this.cartSource$.next([])
    this.persistCart([]);
  }

  private persistCart(cart: Cart[]): void {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

}
