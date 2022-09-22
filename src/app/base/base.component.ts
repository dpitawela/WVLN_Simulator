import { AfterViewChecked, ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LambdaService } from '../services/lambda.service';
import { StoreModel } from '../types/model';
import { RecordSuccessDialogComponent } from './record-success-dialog/record-success-dialog.component';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements AfterViewChecked {
  isDiscarded:boolean = false
  isRecordingStarted: boolean = false

  constructor(private cdr: ChangeDetectorRef, private lambdaService: LambdaService, private dialog: MatDialog) {
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  async saveRecording(recordings: StoreModel) {
    let result: string = await this.lambdaService.storeActions(recordings)
    if (result.includes('R_')) { // success
      this.dialog.open(RecordSuccessDialogComponent, { data: { successToken: result } })
    }
  }
}
