import { Cart, CartItem } from "../models/Cart";
import { Checkout, CheckoutModifier } from "../models/Checkout";
import { Modifier, ModifierList } from "../models/Item";

export class CheckoutUtil {

  static getCheckout(cart: Cart): Checkout[] {
    return cart.items.map((data: CartItem) => {
      const modifiers = data.modifiers.map((modifier: Modifier) => {
        return {
          id: modifier.id,
          modifierGroupName: modifier.modifierGroupName,
          modifierItems: modifier.modifierItems.
            map((modifierItem: ModifierList) => {
              return {
                id: modifierItem.id,
                modifier_name: modifierItem.modifier_name,
                modifiersGroupId: modifierItem.modifiersGroupId,
                isSelected: modifierItem.isSelected,
                modifierPrice1: modifierItem.modifierPrice1
              }
            }),
          modifierItemsText: modifier.modifierItems.length ? modifier.modifierItems
            .reduce((prev: string, next: ModifierList) => next.isSelected ? prev + next.modifier_name + ', ' : prev, '').replace(/,\s*$/, '') : ''
        };
      });
      return {
        id: data.id,
        itemname: data.itemname,
        itemprice: data.itemprice,
        isTaxable: data.isTaxable,
        imgUrl: data.imgUrl,
        desc: data.desc,
        totalPrice: data.totalPrice,
        quantity: data.quantity,
        modifiers: modifiers,
        specialInstructions: data.specialInstructions,
        itemText: modifiers
          .reduce((prev: string, modifier: CheckoutModifier) => modifier.modifierItemsText ? prev + modifier.modifierItemsText + ', ' : '', '').replace(/,\s*$/, '')
      };
    });
  }

}