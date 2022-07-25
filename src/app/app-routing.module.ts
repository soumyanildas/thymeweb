import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './checkout/checkout.component';
import { DetailsComponent } from './details/details.component';
import { ErrorComponent } from './error/error.component';
import { HomeComponent } from './home/home.component';
import { ListingComponent } from './listing/listing.component';
import { PaymentComponent } from './payment/payment.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'listings',
    component: ListingComponent
  },
  {
    path: 'details/:id',
    component: DetailsComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  },
  {
    path: 'payment',
    component: PaymentComponent
  },
  {
    path: '**',
    component: ErrorComponent
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
