import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LambdaService } from '../services/lambda.service';
import { StoreModel } from '../types/model';
import { RecordSuccessDialogComponent } from './record-success-dialog/record-success-dialog.component';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent {
  isRecordingStarted: boolean = false
  constructor(private lambdaService: LambdaService, private dialog: MatDialog) {
  }

  async saveRecording(recordings: StoreModel) {
    let result: string = await this.lambdaService.storeActions(recordings)
    if (result.includes('R_')) { // success
      this.dialog.open(RecordSuccessDialogComponent, { data: { successToken: result } })
    }
  }
}
