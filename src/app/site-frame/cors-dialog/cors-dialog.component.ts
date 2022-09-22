import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cors-dialog',
  templateUrl: './cors-dialog.component.html',
  styleUrls: ['./cors-dialog.component.css']
})
export class CorsDialogComponent {

  constructor(private dialogRef: MatDialogRef<CorsDialogComponent>) {
    dialogRef.disableClose = true
    dialogRef.addPanelClass('my-class')
  }
}
