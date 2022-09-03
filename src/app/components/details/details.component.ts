import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, takeUntil, tap } from 'rxjs';
import { Department, DepartmentModified } from '../../models/Department';
import { Item, ItemModified } from '../../models/Item';
import { Store, StoreModified } from '../../models/Store';
import { StoreService } from '../../services/store/store.service';
import { AutoUnsubscribeComponent } from '../../shared/auto-unsubscribe/auto-unsubscribe.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent extends AutoUnsubscribeComponent implements OnInit {

  currentPage!: number;
  items: ItemModified[] = [];
  store!: StoreModified;
  screenMode!: string;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private storeService: StoreService,
    private route: ActivatedRoute
  ) {
    super();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    let screenWidth = window.innerWidth;

    if (screenWidth > 760) {
      this.screenMode = 'big'
    }
    else {
      this.screenMode = 'small';
    }
  }


  ngOnInit(): void {
    //Initial screenMode setup
    let screenWidth = window.innerWidth;
    if (screenWidth > 760) {
      this.screenMode = 'big'
    }
    else {
      this.screenMode = 'small';
    }
    this._getDetails();
  }

  private _getDetails(): void {
    let departments: Department[] = [];
    let store: Store;
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.storeService.getStore(id)
        .pipe(
          tap((innerResponse: Store) => store = innerResponse),
          switchMap(() => this.storeService.getDepartments(store.id)),
          tap((innerResponse: Department[]) => departments = innerResponse),
          switchMap(() => this.storeService.getItems(id)),
          map((response: Item[]) => {
            // creating a modified item structure for frontend
            return response.map((data: Item) => {
              const item = new Item(data.inventoryDTO, data.modifierGroupList, data.modifierList);
              return {
                ...item.modify()
              }
            })
          }),
          map((response: ItemModified[]) => {
            // mapping department to their items
            const departmentsModified = departments.map((department: Department) => {
              return {
                ...department,
                items: response.filter((item: ItemModified) => item.departmentId === department.id)
              }
            });
            return {
              ...store,
              departments: departmentsModified
            };
          }),
          takeUntil(this.destroy$))
        .subscribe((response: StoreModified) => {
          console.log('🚀 ~ file: details.component.ts ~ line 66 ~ DetailsComponent ~ .subscribe ~ response', response);
          if (response) {
            this.store = response;
            this.currentPage = response.departments.findIndex((department: DepartmentModified) => department.items.length);
          }
        });
    }
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
