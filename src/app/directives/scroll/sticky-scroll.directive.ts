import { Directive, HostBinding, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '[stickyScroll]'
})
export class StickyScrollDirective implements OnInit, OnDestroy {

  @HostBinding('class.sticky') sticky!: boolean;

  ngOnInit() {
    if (typeof window !== undefined) {
      window.addEventListener('scroll', () => this._checkScroll());
    }

  }

  ngOnDestroy() {
    if (typeof window !== undefined) {
      window.removeEventListener('scroll', () => this._checkScroll());
    }
  }

  private _checkScroll() {
    if (typeof window !== undefined) {
      this.sticky = (window.pageYOffset > 425);
    }
  }

}
