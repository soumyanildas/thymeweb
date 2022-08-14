import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Cart } from 'src/app/models/Cart';
import { CartService } from 'src/app/services/cart/cart.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentGuard implements CanActivate {

  constructor(
    private cartService: CartService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.cartService.viewCart()
      .pipe(map((response: Cart) => {
        if (response && response.items && response.items.length) {
          return true;
        }
        this.router.navigateByUrl('/home');
        return false;
      }));
  }

}
