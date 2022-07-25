export interface ItemDetails {
  readonly name: string;
  readonly price: number;
  readonly description?: string;
  addOns: AddOn[];
}

export interface AddOn {
  readonly name: string;
  readonly price: number;
}