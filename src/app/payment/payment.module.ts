import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutDeliveryComponent } from './checkout-delivery/checkout-delivery.component';
import { PaymentComponent } from './payment.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: PaymentComponent
  }
];

@NgModule({
  declarations: [
    PaymentComponent,
    CheckoutDeliveryComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class PaymentModule { }
