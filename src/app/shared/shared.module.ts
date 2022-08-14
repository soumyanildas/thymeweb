import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CartComponent } from './cart/cart.component';
import { RouterModule } from '@angular/router';
import { CheckoutMenuComponent } from './checkout-menu/checkout-menu.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    CartComponent,
    CheckoutMenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    CheckoutMenuComponent
  ]
})
export class SharedModule { }
