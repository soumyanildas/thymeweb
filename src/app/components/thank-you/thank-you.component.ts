import { Component, OnInit } from '@angular/core';
import { PaymentService } from 'src/app/services/payment/payment.service';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss']
})
export class ThankYouComponent implements OnInit {

  data: any;

  constructor(
    private paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    this.paymentService.getPayment()
      .subscribe((response) => {
        this.data = response;
      });
  }

}
