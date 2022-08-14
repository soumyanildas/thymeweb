import { Component, OnInit } from '@angular/core';
import { map, tap, takeUntil } from 'rxjs';
import { Cart } from 'src/app/models/Cart';
import { Checkout } from 'src/app/models/Checkout';
import { CartService } from 'src/app/services/cart/cart.service';
import { CheckoutUtil } from 'src/app/util/checkout-util';
import { AutoUnsubscribeComponent } from '../auto-unsubscribe/auto-unsubscribe.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent extends AutoUnsubscribeComponent implements OnInit {

  cart: Cart = {
    store: {},
    items: []
  };

  checkout: Checkout[] = [];

  total: number = 0;

  constructor(
    private cartService: CartService
  ) {
    super();
  }

  ngOnInit(): void {
    this._loadCart();
  }

  private _loadCart(): void {
    this.cartService.viewCart()
      .pipe(
        tap((response: Cart) => this.cart = response),
        map(() => {
          if (this.cart.items.length) {
            const checkout = CheckoutUtil.getCheckout(this.cart);
            this.total = parseFloat(checkout.reduce((prev: number, next: Checkout) => prev + next.totalPrice, 0).toFixed(2));
            return checkout;
          }
          return [];
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((response: Checkout[]) => {
        this.checkout = response;
      });

  }

}
