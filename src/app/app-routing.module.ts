import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';
import { PaymentGuard } from './guards/payment/payment.guard';
import { RouteGuard } from './guards/route/route.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'details/' + environment.storeId,
    pathMatch: 'full'
  },
  // {
  //   path: 'home',
  //   loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  //   canActivate: [RouteGuard],
  //   title: 'Home | Thymeweb'
  // },
  {
    path: 'details/:id',
    loadChildren: () => import('./details/details.module').then((m) => m.DetailsModule),
    canActivate: [RouteGuard],
    title: 'Store | Thymeweb'
  },
  {
    path: 'checkout',
    loadChildren: () => import('./checkout/checkout.module').then((m) => m.CheckoutModule),
    canActivate: [RouteGuard, PaymentGuard],
    title: 'Checkout | Thymeweb'
  },
  {
    path: 'payment',
    loadChildren: () => import('./payment/payment.module').then((m) => m.PaymentModule),
    canActivate: [RouteGuard, PaymentGuard],
    title: 'Payments | Thymeweb'
  },
  {
    path: '**',
    loadChildren: () => import('./error/error.module').then((m) => m.ErrorModule)
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
