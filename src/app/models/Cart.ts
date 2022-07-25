import { Item } from "./Item";

export interface Cart {
  item: Item;
  quantity: number;
  totalPrice: number; 
}