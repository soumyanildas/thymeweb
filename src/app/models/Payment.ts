export interface Payment {
  order_info: PaymentOrderInfo;
  customer?: PaymentCustomer;
  store: Partial<PaymentStore>;
  invoice: {
    grandtotal: number;
    subtotal: number;
    tax: number;
    taxedSales: number;
    nonTaxedSales: number;
    items: PaymentItem[];
  }
  payment: {
    payment_token?: string;
    payment_type?: string;
    payment_status?: string;
  }
}

export interface PaymentOrderInfo {
  created_time: number;
  current_state: string;
  order_type: string;
  pickup_time: number;
  store_id: string;
}



export interface PaymentItem {
  id: string;
  itemname: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
  taxable: boolean;
  modifiers?: PaymentModifier[];
}


export interface PaymentModifier {
  id: string;
  modifiername: string;
  quantity: number;
  price: number;
  taxable: boolean;
}

export interface PaymentCustomer {
  first_name: string;
  phone: string;
  "e-mail": string;
}

export interface PaymentStore {
  id: string;
  name: string;
}