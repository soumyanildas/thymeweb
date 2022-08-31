import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './details.component';
import { RouterModule, Routes } from '@angular/router';
import { DetailsItemComponent } from './details-item/details-item.component';
import { DetailsCardComponent } from './details-card/details-card.component';
import { ModifierDialogComponent } from './modifier-dialog/modifier-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { StickyScrollDirective } from '../../directives/scroll/sticky-scroll.directive';
import { InViewportDirective } from '../../directives/in-viewport/in-viewport.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: DetailsComponent
  }
];


@NgModule({
  declarations: [
    DetailsComponent,
    DetailsItemComponent,
    DetailsCardComponent,
    ModifierDialogComponent,
    StickyScrollDirective,
    InViewportDirective
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class DetailsModule { }
