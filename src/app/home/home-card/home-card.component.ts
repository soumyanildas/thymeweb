import { Component, Input, OnInit } from '@angular/core';
import { ItemModified } from 'src/app/models/Item';
import { Store } from 'src/app/models/Store';

@Component({
  selector: 'app-home-card',
  templateUrl: './home-card.component.html',
  styleUrls: ['./home-card.component.scss']
})
export class HomeCardComponent implements OnInit {

  @Input()
  store!: Store;

  constructor() { }

  ngOnInit(): void {
  }

}
