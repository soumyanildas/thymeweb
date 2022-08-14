export interface Payment {
  orderID: string;
  display_id: string;
  current_state: string;
  customer: PaymentCustomer;
  store: Partial<PaymentStore>;
  serivceType: string;
  invoice: {
    items: PaymentItem[];
    payment?: string;
  }
}

export interface PaymentItem {
  id: string;
  itemname: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
  selected_modifier?: PaymentModifier[];
}


export interface PaymentModifier {
  id: string;
  modifiername: string;
  quantity: number;
  price: number;
}

export interface PaymentCustomer {
  first_name: string;
  phone: string;
  email: string;
  id: string;
}

export interface PaymentStore {
  id: string;
  name: string;
  merchant_store_id: string;
}