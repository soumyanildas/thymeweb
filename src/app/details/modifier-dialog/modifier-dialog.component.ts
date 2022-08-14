import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { cloneDeep, isEmpty, isEqual, xorWith } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs';
import { Cart } from 'src/app/models/Cart';
import { ItemModified, Modifier, ModifierList } from 'src/app/models/Item';
import { CartService } from 'src/app/services/cart/cart.service';
import { StoreService } from 'src/app/services/store/store.service';
import { AutoUnsubscribeComponent } from 'src/app/shared/auto-unsubscribe/auto-unsubscribe.component';
@Component({
  selector: 'app-modifier-dialog',
  templateUrl: './modifier-dialog.component.html',
  styleUrls: ['./modifier-dialog.component.scss']
})
export class ModifierDialogComponent extends AutoUnsubscribeComponent implements OnInit {

  item!: ItemModified;
  cart: Cart = {
    store: {},
    items: []
  };
  calculatedPrice: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data: any,
    private dialog: MatDialogRef<ModifierDialogComponent>,
    private cartService: CartService,
    private storeService: StoreService,
    private toastr: ToastrService
  ) {
    super();
    if (data.item) {
      this.item = cloneDeep(data.item);
    }
  }

  ngOnInit(): void {
    this._loadCart();
    this.calculatedPrice = this._getTotalPrice();
  }

  submit(): void {
    this.item.modifiers.forEach((modifier: Modifier) => {
      modifier.isValid = true;
      const isMin = this._checkMin(modifier.minItems, modifier.modifierItems);
      if (modifier.modifierItems.length && isMin) {
        modifier.errorMessage = `Please select at least ${modifier.minItems} item(s)`;
        modifier.isValid = false;
      }
    });
    if (this._isValid()) {
      this._addToCart();
      this.dialog.close({
        addToCart: true
      });
    }
  }

  selectModifier(modifierIndex: number, modifierItemIndex: number): void {
    this.calculatedPrice = this._getTotalPrice();
    const modifier = this.item.modifiers[modifierIndex];
    modifier.isValid = true;
    const isMin = this._checkMin(modifier.minItems, modifier.modifierItems);
    const isMax = this._checkMax(modifier.maxItems, modifier.modifierItems);
    if (!isMin) {
      modifier.errorMessage = `Please select at least ${modifier.minItems} item(s)`;
      modifier.isValid = false;
    }
    if (!isMax) {
      modifier.modifierItems[modifierItemIndex].isSelected = !modifier.modifierItems[modifierItemIndex].isSelected;
      modifier.isDisabled = false;
    } else {
      modifier.isDisabled = true;
    }
  }

  private _loadCart(): void {
    this.cartService.viewCart()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: Cart) => {
        this.cart = response;
      });
  }

  private _addToCart(): void {
    if (this.cart.items.length) {
      if (this.data.store.storeName === this.cart.store?.storeName) {
        this.cart.store = this.data.store;
      } else {
        this.toastr.warning('Cleared cart as you are adding items from a different store');
        this.cartService.updateCart({
          store: {},
          items: []
        });
      }
    }
    let foundIndex = null;
    let isItemFound = false;
    loop1:
    for (let i = 0; i < this.cart.items.length; i += 1) {
      for (let j = 0; j < this.item.modifiers.length; j += 1) {
        const k = this.cart.items[i].modifiers.findIndex((modifier: Modifier) => modifier.id === this.item.modifiers[j].id);
        if (k >= 0) {
          if (this.item.modifiers[j].modifierItems && this.item.modifiers[j].modifierItems.length && this.cart.items[i].modifiers[k].modifierItems && this.cart.items[i].modifiers[k].modifierItems.length) {
            isItemFound = isEmpty(xorWith(this.cart.items[i].modifiers[k].modifierItems, this.item.modifiers[j].modifierItems, isEqual)) && (this.cart.items[i].id === this.item.id);
          }
        }
        if (isItemFound) {
          foundIndex = i;
          break loop1;
        }
      }
    }
    // calculating price
    const calculatedPrice = this._getTotalPrice();
    this.cart.store = this.data.store;
    if (foundIndex !== null) {
      this.cart.items[foundIndex].quantity++;
      this.cart.items[foundIndex].totalPrice += calculatedPrice;
    } else {
      this.cart.items.push({
        ...this.item,
        quantity: 1,
        totalPrice: calculatedPrice
      });
    }
    this.cartService.updateCart(this.cart);
  }

  private _getTotalPrice(): number {
    return this.item.itemprice + this.item.modifiers
      .reduce((prev: number, next: Modifier) => prev + next.modifierItems
        .reduce((prev: number, next: ModifierList) => prev + next.modifierPrice1, 0), 0)
  }

  private _isValid(): boolean {
    return !(this.item.modifiers.findIndex((modifier: Modifier) => !modifier.isValid) !== -1);
  }

  private _checkMin(minItems: number, modifierItems: ModifierList[]): boolean {
    return modifierItems.reduce((prev, next) => prev + (next.isSelected ? 1 : 0), 0) < minItems;
  }

  private _checkMax(maxItems: number, modifierItems: ModifierList[]): boolean {
    return modifierItems.reduce((prev, next) => prev + (next.isSelected ? 1 : 0), 0) > maxItems;
  }

}
