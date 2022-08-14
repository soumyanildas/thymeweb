import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TEConnect, TeConnectNgModule } from '@magensa/te-connect-ng';
import { createTEConnect } from '@magensa/te-connect';
import { environment } from 'src/environments/environment';

const TE_CONNECT: TEConnect = createTEConnect(environment.teConnectKey);

const routes: Routes = [
  {
    path: '',
    component: PaymentComponent
  }
];

@NgModule({
  declarations: [
    PaymentComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TeConnectNgModule.forRoot(TE_CONNECT),
    RouterModule.forChild(routes)
  ]
})
export class PaymentModule { }
