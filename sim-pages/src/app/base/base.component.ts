import { Component, OnInit } from '@angular/core';
import { LambdaService } from '../services/lambda.service';
import { StoreModel } from '../types/storeModel';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {
  isRecordingStarted: boolean = false
  constructor(private lambdaService: LambdaService) {
  }

  ngOnInit(): void {
  }

  saveRecording(recordings: StoreModel) {
    console.log(recordings)
    // this.lambdaService.storeActions(recordings)
  }
}
