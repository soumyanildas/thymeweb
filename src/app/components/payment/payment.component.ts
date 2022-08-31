import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreatePaymentResponse, StylesConfig } from '@magensa/te-connect-ng';
import { ToastrService } from 'ngx-toastr';
import { map, takeUntil, tap } from 'rxjs';
import { Cart } from '../../models/Cart';
import { Checkout } from '../../models/Checkout';
import { ModifierList } from '../../models/Item';
import { Payment, PaymentItem, PaymentModifier } from '../../models/Payment';
import { CartService } from '../../services/cart/cart.service';
import { PaymentService } from '../../services/payment/payment.service';
import { AutoUnsubscribeComponent } from '../../shared/auto-unsubscribe/auto-unsubscribe.component';
import { CheckoutUtil } from '../../util/checkout-util';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent extends AutoUnsubscribeComponent implements OnInit {
  styles: StylesConfig = {
    base: {
      backgroundColor: '#272727'
    },
    boxes: {
      labelColor: "#fff",
      textColor: "#fff",
      borderRadius: 10,
      errorColor: "#CF6679",
      inputColor: '#000'
    }
  }
  deliveryType: string = 'pickup';
  addressForm!: FormGroup;
  cart: Cart = {
    store: {},
    items: []
  };
  payment!: Payment;
  tax: number = 0;
  isDisabled: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private paymentService: PaymentService,
    private router: Router,
    private toastr: ToastrService
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
        map((response: Checkout[]) => {
          // creating items array with selected modifiers
          let items: PaymentItem[] = [];
          for (let i = 0; i < response.length; i += 1) {
            items.push({
              id: response[i].id,
              itemname: response[i].itemname,
              quantity: response[i].quantity * 100,
              price: response[i].totalPrice * 100,
              specialInstructions: response[i].specialInstructions || '',
              taxable: response[i].isTaxable,
            });
            let modifiers = [];
            for (let j = 0; j < response[i].modifiers.length; j += 1) {
              modifiers[j] = response[i].modifiers[j].modifierItems.map((modifierItem: ModifierList) => {
                if (modifierItem.isSelected) {
                  return {
                    id: modifierItem.id,
                    modifiername: modifierItem.modifier_name,
                    quantity: 100, // make it dynamic later on
                    price: modifierItem.modifierPrice1,
                    taxable: response[i].isTaxable
                  };
                }
                return null;
              }).filter((modifierItem) => modifierItem) as PaymentModifier[];
            }
            items[i].modifiers = modifiers.flat();
          }
          return items;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((response: PaymentItem[]) => {
        const taxedSales = this._calculateTaxedSales(response);
        const nonTaxedSales = this._calculateNonTaxedSales(response);
        const total = (taxedSales + nonTaxedSales) * 100;
        this.payment = {
          order_info: {
            pickup_time: 0,
            order_type: this.deliveryType,
            created_time: Math.floor(new Date().getTime() / 1000),
            current_state: 'Created',
            store_id: this.cart.store.id || ''
          },
          store: {
            id: this.cart.store?.id,
            name: this.cart.store?.storeName,
          },
          invoice: {
            grandtotal: total + (this.tax * 100),
            subtotal: total,
            tax: this.tax * 100,
            taxedSales: taxedSales * 100,
            nonTaxedSales: nonTaxedSales * 100,
            items: response,
          },
          payment: {}
        }
      });
  }

  private _calculateTaxedSales(items: PaymentItem[]): number {
    let taxedSales = 0;
    for (let i = 0; i < items.length; i += 1) {
      if (items[i].taxable && this.cart.store.taxRate) {
        this.tax += parseFloat(((items[i].price / 100) * this.cart.store.taxRate / (100 * 100)).toFixed(2));
        taxedSales += (items[i].price / 100);
      }
    }
    this.tax = parseFloat(this.tax.toFixed(2));
    return parseFloat(taxedSales.toFixed(2));
  }

  private _calculateNonTaxedSales(items: PaymentItem[]): number {
    let nonTaxedSales = 0;
    for (let i = 0; i < items.length; i += 1) {
      if (!items[i].taxable) {
        nonTaxedSales += (items[i].price / 100);
      }
    }
    return parseFloat(nonTaxedSales.toFixed(2));
  }

  private _createForm(): void {
    this.addressForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      phone: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]{3}-[0-9]{3}-[0-9]{4}$')])],
      name: ['', Validators.required],
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
      this.isDisabled = true;
      if (response.status === 200) {
        this.payment.customer = {
          first_name: this.addressForm.value.name,
          phone: this.addressForm.value.phone,
          "e-mail": this.addressForm.value.email,
        };
        this.payment.payment.payment_token = response.token;
        this.payment.payment.payment_type = 'CreditCard';
        this.payment.payment.payment_status = 'approved';
        console.log('🚀 ~ file: payment.component.ts ~ line 135 ~ PaymentComponent ~ submitPayment ~ this.payment', this.payment);
        for (let i = 0; i < this.payment.invoice.items.length; i += 1) {
          if (!this.payment.invoice.items[i].specialInstructions) {
            delete this.payment.invoice.items[i].specialInstructions;
          }
        }
        this.paymentService.submitInvoice(this.payment)
          .subscribe((response) => {
            this.paymentService.setPayment(response);
            this.addressForm.reset();
            this.cartService.emptyCart();
            this.toastr.success('Payment successful. Please note down order number and order id');
            this.router.navigateByUrl('/thank-you');
            this.isDisabled = false;
          }, (error) => {
            this.toastr.error('Something went wrong. Please try again later.');
            this.isDisabled = false;
          });
      }
    }
  }
}
