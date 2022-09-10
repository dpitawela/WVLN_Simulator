import { AfterViewChecked, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { StoreModel } from '../types/model';
import { Buffer } from 'buffer';
import { MatDialog } from '@angular/material/dialog';
import { LoadDataComponent } from './load-data/load-data.component';

@Component({
  selector: 'app-playback-base',
  templateUrl: './playback-base.component.html',
  styleUrls: ['./playback-base.component.css']
})
export class PlaybackBaseComponent implements AfterViewChecked {
  retrievedActions: StoreModel | undefined;
  isLoaded: boolean = false

  isPlaying: boolean = false
  isPaused: boolean = false
  jumpNextStep: boolean = false
  jumpPreviousStep: boolean = false

  nActions = 0
  currentIteration: number = -1

  constructor(private cdr: ChangeDetectorRef, private dialog: MatDialog) {
    // opens the dialog and loads data for playing
    const dialogRef = this.dialog.open(LoadDataComponent)
    dialogRef.afterClosed().subscribe((result: StoreModel) => {
      // converting html from base64 to binary in all click actions
      if (result != null && result.actions)
        for (let action of result.actions) {
          if (action.type == 'click' && action.outer_html) {
            action.outer_html = Buffer.from(action.outer_html, 'base64').toString('binary')
          }
        }
      this.retrievedActions = result
    });
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  updateIteration(iteration: number) {
    this.currentIteration = iteration + 1
  }

  getTotalActions(nActions: number) {
    this.nActions = nActions
  }
}