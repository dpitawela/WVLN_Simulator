import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {
  isRecordingStarted: boolean = false
  constructor() {
  }

  ngOnInit(): void {
  }

  saveRecording(recordings:string){
    console.log(recordings)
  }
}
