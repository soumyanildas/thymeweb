export interface Checkout {
  id: string;
  readonly itemname: string;
  itemprice: number;
  readonly isTaxable: boolean;
  readonly imgUrl: string;
  readonly desc?: string;
  quantity: number;
  totalPrice: number;
  modifiers: CheckoutModifier[];
  specialInstructions?: string;
  readonly itemText?: string;
}

export interface CheckoutModifierGroupList {
  readonly id: string;
  readonly modifierGroupName: string;
  readonly modifierItemsText?: string;
}

export interface CheckoutModifierList {
  readonly id: string;
  readonly modifier_name: string;
  readonly modifiersGroupId: string;
  isSelected: boolean;
  modifierPrice1: number;
}

export interface CheckoutModifier extends CheckoutModifierGroupList {
  modifierItems: CheckoutModifierList[];
}