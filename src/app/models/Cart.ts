import { ItemModified } from "./Item";
import { Store } from "./Store";

export interface Cart {
  store: Partial<Store>;
  items: CartItem[];
}

export interface CartItem extends ItemModified {
  quantity: number;
  totalPrice: number;
}