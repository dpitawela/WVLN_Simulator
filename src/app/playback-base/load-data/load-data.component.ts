import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LambdaService } from 'src/app/services/lambda.service';
import { StoreModel } from 'src/app/types/model';

@Component({
  selector: 'app-load-data',
  templateUrl: './load-data.component.html',
  styleUrls: ['./load-data.component.css']
})
export class LoadDataComponent {
  token: string = ''
  warning: boolean = false

  constructor(private dialogRef: MatDialogRef<LoadDataComponent>, private lambdaService: LambdaService) {
    dialogRef.disableClose = true
    dialogRef.addPanelClass('my-class')
  }

  async loadData(): Promise<void> {
    console.log(this.token)
    let data: StoreModel | null = await this.lambdaService.readActions(this.token.trim())
    if (data != null) {
      this.warning = false
      this.closeDialog(data)
    } else {
      this.warning = true
    }
  }

  closeDialog(result: StoreModel) {
    this.dialogRef.close(result)
  }
}
