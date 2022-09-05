import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-load-data',
  templateUrl: './load-data.component.html',
  styleUrls: ['./load-data.component.css']
})
export class LoadDataComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<LoadDataComponent>) {
    dialogRef.disableClose = false
    dialogRef.addPanelClass('my-class')
  }

  ngOnInit(): void {
  }

}
