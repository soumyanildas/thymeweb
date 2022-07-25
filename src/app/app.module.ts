import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorInterceptor } from './interceptors/error/error.interceptor';
import { TokenInterceptor } from './interceptors/token/token.interceptor';
import { API_BASE_URL } from './services/http/http.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CheckoutComponent } from './checkout/checkout.component';
import { SharedModule } from './shared/shared.module';
import { PaymentComponent } from './payment/payment.component';
import { ListingComponent } from './listing/listing.component';
import { ErrorComponent } from './error/error.component';
import { DetailsComponent } from './details/details.component';
import { ListingCardComponent } from './listing/listing-card/listing-card.component';
import { DetailsItemComponent } from './details/details-item/details-item.component';
import { DetailsCardComponent } from './details/details-card/details-card.component';
import { CheckoutDeliveryComponent } from './payment/checkout-delivery/checkout-delivery.component';
import { HomeComponent } from './home/home.component';
import { StickyScrollDirective } from './directives/scroll/sticky-scroll.directive';
import { InViewportDirective } from './directives/in-viewport/in-viewport.directive';
import { MatDialogModule } from '@angular/material/dialog';
import { ModifierDialogComponent } from './details/modifier-dialog/modifier-dialog.component';
@NgModule({
  declarations: [
    AppComponent,
    CheckoutComponent,
    PaymentComponent,
    ListingComponent,
    ErrorComponent,
    DetailsComponent,
    ListingCardComponent,
    DetailsItemComponent,
    DetailsCardComponent,
    CheckoutDeliveryComponent,
    HomeComponent,
    StickyScrollDirective,
    InViewportDirective,
    ModifierDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    MatDialogModule
  ],
  providers: [
    {
      provide: API_BASE_URL,
      useValue: environment.baseURL
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
