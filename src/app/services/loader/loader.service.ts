import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  showLoaderSource$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  updateLoader(status: boolean): void {
    this.showLoaderSource$.next(status);
  }

}
