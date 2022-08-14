import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { StoreService } from 'src/app/services/store/store.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanActivate {

  constructor(
    private router: Router,
    private storeService: StoreService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.storeService.shopLocationSource$.asObservable()
      .pipe(map((shopLocation: any) => {
        /** 
         * check if shopLocation is present and there is only one location
         * then route to details page always, otherwise let it go through to home page
         */
        if (shopLocation && shopLocation.length === 1) {
          this.router.navigateByUrl('/details/' + shopLocation[0].id);
          return false;
        }
        return true;
      }));
  }

}
