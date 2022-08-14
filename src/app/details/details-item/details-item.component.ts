import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs';
import { Cart } from 'src/app/models/Cart';
import { ItemModified } from 'src/app/models/Item';
import { Store } from 'src/app/models/Store';
import { CartService } from 'src/app/services/cart/cart.service';
import { AutoUnsubscribeComponent } from 'src/app/shared/auto-unsubscribe/auto-unsubscribe.component';
import { ModifierDialogComponent } from '../modifier-dialog/modifier-dialog.component';

@Component({
  selector: 'app-details-item',
  templateUrl: './details-item.component.html',
  styleUrls: ['./details-item.component.scss']
})
export class DetailsItemComponent extends AutoUnsubscribeComponent implements OnInit {

  @Input()
  item!: ItemModified;

  @Input()
  store!: Store;

  cart: Cart = {
    store: {},
    items: []
  };


  constructor(
    private dialog: MatDialog,
    private cartService: CartService
  ) {
    super();
  }

  ngOnInit(): void {
    this._syncItemWithCart();
  }

  addItem(): void {
    this.item.count = 1;
  }

  increaseItem(): void {
    this.addModifiers();
  }

  decreaseItem(): void {
    --this.item.count;
    if (this.item.count) {
      for (let i = 0; i < this.cart.items.length; i += 1) {
        if (this.cart.items[i].id === this.item.id) {
          this.cart.items[i].quantity = this.item.count;
          break;
        }
      }
    } else {
      for (let i = 0; i < this.cart.items.length; i += 1) {
        if (this.cart.items[i].id === this.item.id) {
          this.cart.items.splice(i, 1);
          break;
        }
      }
    }
    this.cartService.updateCart(this.cart)
  }

  addModifiers(): void {
    const dialogRef = this.dialog.open(ModifierDialogComponent, {
      width: '100%',
      maxWidth: '100vw',
      position: { bottom: '0px' },
      height: '85vh',
      data: {
        store: this.store,
        item: this.item
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  private _syncItemWithCart(): void {
    this.cartService.viewCart()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: Cart) => {
        this.cart = response;
        for (let i = 0; i < this.cart.items.length; i += 1) {
          if (response.items[i].id === this.item.id) {
            this.item.count = response.items[i].quantity;
            if (response.items[i].quantity === 0) {
              this.cart.items.splice(i, 1);
              this.cartService.updateCart(this.cart);
            }
          }
        }
        if (!this.cart.items.length) {
          this.item.count = 0;
        }
      });
  }

}
