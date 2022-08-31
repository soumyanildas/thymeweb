import { Component, Input, OnInit } from '@angular/core';
import { map, takeUntil, tap } from 'rxjs';
import { Cart } from 'src/app/models/Cart';
import { Checkout } from 'src/app/models/Checkout';
import { CartService } from 'src/app/services/cart/cart.service';
import { CheckoutUtil } from 'src/app/util/checkout-util';
import { AutoUnsubscribeComponent } from '../auto-unsubscribe/auto-unsubscribe.component';

@Component({
  selector: 'app-checkout-menu',
  templateUrl: './checkout-menu.component.html',
  styleUrls: ['./checkout-menu.component.scss']
})
export class CheckoutMenuComponent extends AutoUnsubscribeComponent implements OnInit {

  @Input()
  buttonText: string = 'Checkout';

  @Input()
  showPromo: boolean = false;

  @Input()
  showTotalText: boolean = false;

  @Input()
  nextPageLink!: string;

  @Input()
  updateCart: boolean = false;

  cart: Cart = {
    store: {},
    items: []
  };

  checkout: Checkout[] = [];

  total: number = 0;
  taxAmount: number = 0;
  totalAfterTax: number = 0;

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
            this.taxAmount = this._calculateTax(checkout);
            this.totalAfterTax = parseFloat((this.total + this.taxAmount).toFixed(2));
            return checkout;
          }
          return [];
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((response: Checkout[]) => {
        console.log('🚀 ~ file: checkout-menu.component.ts ~ line 56 ~ CheckoutMenuComponent ~ .subscribe ~ response', response);
        this.checkout = response;
      });
  }


  increaseItem(index: number): void {
    this._addToCart(index);
  }

  decreaseItem(index: number): void {
    console.log('🚀 ~ file: checkout-menu.component.ts ~ line 76 ~ CheckoutMenuComponent ~ decreaseItem ~ index', index);
    console.log('🚀 ~ file: checkout-menu.component.ts ~ line 83 ~ CheckoutMenuComponent ~ decreaseItem ~ this.cart.items[index]', this.cart.items[index]);
    // calculating price
    const calculatedPrice = this.cart.items[index].totalPrice / this.cart.items[index].quantity;
    this.cart.items[index].quantity--;
    this.cart.items[index].totalPrice = parseFloat((this.cart.items[index].totalPrice - calculatedPrice).toFixed(2));
    this.cartService.updateCart(this.cart)
    if (this.cart.items[index] && !this.cart.items[index].quantity) {
      this.cart.items.splice(index, 1);
    }
    CheckoutUtil.getCheckout(this.cart);
    if (this.updateCart) {
      this.cartService.updateCart(this.cart);
    }
  }

  private _addToCart(index: number): void {
    // calculating price
    const calculatedPrice = this.cart.items[index].totalPrice / this.cart.items[index].quantity;
    this.cart.items[index].quantity++;
    this.cart.items[index].totalPrice += calculatedPrice;
    CheckoutUtil.getCheckout(this.cart);
    this.cartService.updateCart(this.cart);
  }

  private _calculateTax(checkout: Checkout[]): number {
    let taxAmount = 0;
    for (let i = 0; i < checkout.length; i += 1) {
      if (checkout[i].isTaxable && this.cart.store.taxRate) {
        taxAmount += (this.cart.store.taxRate / (100 * 100)) * checkout[i].totalPrice; 
      }
    }
    return parseFloat(taxAmount.toFixed(2));
  }


}
