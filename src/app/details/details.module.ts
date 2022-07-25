import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './details.component';
import { RouterModule, Routes } from '@angular/router';
import { DetailsItemComponent } from './details-item/details-item.component';
import { DetailsCardComponent } from './details-card/details-card.component';
import { ModifierDialogComponent } from './modifier-dialog/modifier-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

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
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatDialogModule
  ]
})
export class DetailsModule { }
