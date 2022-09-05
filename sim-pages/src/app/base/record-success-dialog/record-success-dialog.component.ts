import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-record-success-dialog',
  templateUrl: './record-success-dialog.component.html',
  styleUrls: ['./record-success-dialog.component.css']
})
export class RecordSuccessDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { successToken: string }, private dialogRef: MatDialogRef<RecordSuccessDialogComponent>) {
    dialogRef.disableClose = true
    dialogRef.addPanelClass('my-class')
  }

}