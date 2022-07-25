import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  currentPage: number = 1;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document
  ) { }

  ngOnInit(): void {
  }

  navigatePage(pageNumber: number): void {
    if (pageNumber !== this.currentPage) {
      this.currentPage = pageNumber;
      this._scrollToView(`page-${this.currentPage}`);
    }
  }

  onAppear(event: any, pageNumber: number) {
    if (event) {
      this.currentPage = pageNumber;
    }
  }

  private _scrollToView(id: string) {
    const top = this.document.getElementById(id)?.offsetTop;
    window?.scrollTo({ top: top ? top + 350 : 0, behavior: 'smooth' });
  }

}
