import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CreatePaymentResponse } from '@magensa/te-connect-ng';
import { map, takeUntil, tap } from 'rxjs';
import { Cart } from '../models/Cart';
import { Checkout } from '../models/Checkout';
import { ModifierList } from '../models/Item';
import { Payment, PaymentModifier } from '../models/Payment';
import { CartService } from '../services/cart/cart.service';
import { AutoUnsubscribeComponent } from '../shared/auto-unsubscribe/auto-unsubscribe.component';
import { CheckoutUtil } from '../util/checkout-util';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent extends AutoUnsubscribeComponent implements OnInit {

  deliveryType: string = 'pickup';
  addressForm!: FormGroup;
  cart: Cart = {
    store: {},
    items: []
  };
  payment!: Payment;

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService
  ) {
    super();
  }

  ngOnInit(): void {
    this._createForm();
    this._loadCart();
  }

  private _loadCart(): void {
    this.cartService.viewCart()
      .pipe(
        tap((response: Cart) => this.cart = response),
        map(() => {
          if (this.cart.items.length) {
            const checkout = CheckoutUtil.getCheckout(this.cart);
            return checkout;
          }
          return [];
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((response: Checkout[]) => {
        let items = [];
        for (let i = 0; i < response.length; i += 1) {
          for (let j = 0; j < response[i].modifiers.length; j += 1) {
            items.push({
              id: response[i].id,
              itemname: response[i].itemname,
              quantity: response[i].quantity,
              price: response[i].totalPrice,
              specialInstructions: response[i].specialInstructions || '',
              select_modifier: response[i].modifiers[j].modifierItems.map((modifierItem: ModifierList) => {
                if (modifierItem.isSelected) {
                  return {
                    id: modifierItem.id,
                    modifiername: modifierItem.modifierName,
                    quantity: 1, // make it dynamic later on
                    price: modifierItem.modifierPrice1
                  };
                }
                return null;
              }).filter((modifierItem) => modifierItem)
            });
          }
        }
        this.payment = {
          orderID: '',
          display_id: '',
          current_state: '',
          serivceType: this.deliveryType,
          customer: {
            first_name: this.addressForm.value.name,
            phone: this.addressForm.value.phone,
            email: this.addressForm.value.email,
            id: ''
          },
          store: {
            id: this.cart.store?.id,
            name: this.cart.store?.storeName,
            merchant_store_id: ''
          },
          invoice: {
            items: items,
          }
        }
      });
  }

  private _createForm(): void {
    this.addressForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      phone: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]{3}-[0-9]{3}-[0-9]{4}$')])],
      name: ['', [Validators.required, Validators.pattern('^[0-9]{3}-[0-9]{3}-[0-9]{4}$')]],
      address: [''],
      city: [''],
      zip: [''],
    });
  }

  changeDeliveryType(event: string): void {
    this.deliveryType = event;
    if (this.deliveryType === 'delivery') {
      this.addressForm.controls['address'].addValidators(Validators.required)
      this.addressForm.controls['city'].addValidators(Validators.required)
      this.addressForm.controls['zip'].addValidators(Validators.required)
    } else {
      this.addressForm.controls['address'].removeValidators(Validators.required)
      this.addressForm.controls['city'].removeValidators(Validators.required)
      this.addressForm.controls['zip'].removeValidators(Validators.required)
    }
  }

  submitPayment(response: CreatePaymentResponse): void {
    if (!this.addressForm.valid) {
      Object.keys(this.addressForm.controls).forEach(field => {
        const control = this.addressForm.get(field);
        if (control instanceof FormControl) {
          control.markAsTouched({ onlySelf: true });
        }
      });
    } else {
      console.log(response);
      if (response.status === 200) {
        this.payment.invoice.payment = response.token;
        console.log('🚀 ~ file: payment.component.ts ~ line 135 ~ PaymentComponent ~ submitPayment ~ this.payment', this.payment);
        // call api here
        // this.addressForm.reset();
      }
    }
  }
}
