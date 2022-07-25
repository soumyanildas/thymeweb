import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModifierDialogComponent } from '../modifier-dialog/modifier-dialog.component';

@Component({
  selector: 'app-details-item',
  templateUrl: './details-item.component.html',
  styleUrls: ['./details-item.component.scss']
})
export class DetailsItemComponent implements OnInit {

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  addModifiers(): void {
    const dialogRef = this.dialog.open(ModifierDialogComponent, {
      width: '100%',
      maxWidth: '100vw',
      position: { bottom: '0px' },
      height: '85vh',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

}
