import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActionModel, StoreModel } from '../types/model';
import { Buffer } from 'buffer';
import { MatDialog } from '@angular/material/dialog';
import { CorsDialogComponent } from './cors-dialog/cors-dialog.component';

@Component({
  selector: 'app-site-frame',
  templateUrl: './site-frame.component.html',
  styleUrls: ['./site-frame.component.css']
})
export class SiteFrameComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() isRecordingStarted: boolean = false; // indicates whether to record
  @Output() isRecordingStartedChange = new EventEmitter<boolean>();

  @Input() isDiscarded: boolean = false; // indicates whether to discard
  @Output() isDiscardedChange = new EventEmitter<boolean>();

  @Output() saveRecording = new EventEmitter<StoreModel>();

  recordings: ActionModel[] = [];
  eventRefresher: any; // interval timer to refresh iframe event bindings

  // for mouse movements
  move_wait_itr: number = 0
  x_pos_old = 0
  y_pos_old = 0

  // for scrolling
  scroll_wait_itr: number = 0
  current_y_pos = window.pageYOffset;
  current_x_pos = window.pageXOffset;
  scrollEvent: MouseEvent | any;
  clickEvent: MouseEvent | any;

  // iframe base url
  url: SafeResourceUrl = ''
  strURL = 'assets/crawled/hansel/hanselfrombasel.com/index.html'
  lastSuccessfulURL: string | undefined

  // to detect iframe
  @ViewChild('myframe') iframe: ElementRef | any;

  constructor(private sanitizer: DomSanitizer, public dialog: MatDialog) {
    this.updateURL(this.strURL)
  }

  ngAfterViewInit(): void {
    let nativeEl = this.iframe.nativeElement;
    this.eventRefresher = setInterval(() => this.eventBinder(nativeEl), 1000)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isRecordingStarted'] != null && this.isRecordingStarted) { // when recording started
      let nativeEl: HTMLIFrameElement = this.iframe.nativeElement;
      // console.log(nativeEl.contentWindow?.location.pathname.substring(1), this.strURL)
      if (nativeEl.contentWindow?.location.pathname.substring(1) != this.strURL)
        this.updateURL(this.strURL) // always recording starts from the index page
    }
    else if (changes['isRecordingStarted'] != null && !this.isRecordingStarted && this.recordings.length > 0) {
      // when recording stopped
      this.saveRecording.emit({ url: this.strURL, actions: this.recordings.slice() } as StoreModel)
      this.recordings.splice(0);
    }
    else if (changes['isDiscarded'] != null && this.isDiscarded) { // when discarded
      this.recordings.splice(0); // discarding recordings
      this.isDiscardedChange.emit(false)
      this.isRecordingStartedChange.emit(false)
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.eventRefresher)
  }

  // this function refreshes all event bindings to the iframe every second
  eventBinder(nativeEl: ElementRef | any): void {
    nativeEl.contentWindow.removeEventListener('click', this.clickEvent)
    this.clickEvent = (event: any) => this.clickDetect(event, nativeEl)
    nativeEl.contentWindow.addEventListener('click', this.clickEvent)

    // nativeEl.contentWindow.removeEventListener('mousemove', this.moveDetect)
    // nativeEl.contentWindow.addEventListener('mousemove', this.moveDetect)

    // nativeEl.contentWindow.removeEventListener('scroll', this.scrollEvent)
    // this.scrollEvent = (event: MouseEvent) => this.scrollDetect(event, nativeEl)
    // nativeEl.contentWindow.addEventListener('scroll', this.scrollEvent)
  }

  // -------------- event listners that work inside iframe content window (child) ---------------

  clickDetect(event: any, element: any): void {
    // detects if only clicked on a link
    let data: any = {}
    let domRect: DOMRect = {
      height: 0,
      width: 0,
      x: 0,
      y: 0,
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
      toJSON: function () {
        throw new Error('Function not implemented.');
      }
    };

    if (event.target.closest("a") != null) {
      let anchorTag: HTMLAnchorElement = event.target.closest("a")
      domRect = anchorTag.getBoundingClientRect()
      data = { 'type': 'click', 'href': anchorTag.getAttribute("href"), 'outer_html': anchorTag.outerHTML }

    } else if (event.target.closest("button") != null) {
      let button: HTMLButtonElement = event.target.closest("button")
      domRect = button.getBoundingClientRect()
      data = { 'type': 'click', 'href': '#', 'outer_html': button.outerHTML }

    } else if (event.target.closest("input") != null) {
      let input: HTMLInputElement = event.target.closest("input")
      domRect = input.getBoundingClientRect()
      data = { 'type': 'click', 'href': '#', 'outer_html': input.outerHTML }
    }
    // console.log(event.target.outerHTML)
    // console.log(event.target['baseURI'])

    if (data['type'] != null) {
      // coordinates user actually clicked
      // data['x'] = event.clientX
      // data['y'] = event.clientY

      data['x'] = domRect.x
      data['y'] = domRect.y
      data['width'] = domRect.width
      data['height'] = domRect.height

      // data about scroll
      data['x_offset'] = element.contentWindow.pageXOffset
      data['y_offset'] = element.contentWindow.pageYOffset
    }

    parent.postMessage(data)
  }

  moveDetect(event: MouseEvent): void {
    parent.postMessage({ 'type': 'move', 'x': event.clientX, 'y': event.clientY })
  }

  scrollDetect(event: MouseEvent, element: any): void {
    parent.postMessage({ 'type': 'scroll', 'y_offset': element.contentWindow.pageYOffset, 'x_offset': element.contentWindow.pageXOffset })
  }

  // -------------- parent level event handlers ---------------
  // a window level message listner to captures postMessages from iframe document
  @HostListener("window:message", ["$event"])
  reciveDataFromIframe(message: any): void {
    if (message.data['type'] == 'click') {
      this.clickHandle(message)
    } else if (message.data['type'] == 'move') {
      this.moveHandle(message)
    } else if (message.data['type'] == 'scroll') {
      this.scrollHandle(message)
    }
  }

  clickHandle(message: MessageEvent): void {
    let clickAction: ActionModel = {
      type: message.data['type'],

      x: message.data['x'],
      y: message.data['y'],
      height: message.data['height'],
      width: message.data['width'],

      x_offset: message.data['x_offset'],
      y_offset: message.data['y_offset'],

      href: message.data['href'],
      outer_html: Buffer.from(message.data['outer_html'], 'binary').toString('base64')
    }
    if (this.isRecordingStarted) {
      this.recordings.push(clickAction)
      // console.log(clickAction)
    }
  }

  moveHandle(message: MessageEvent): void {
    this.move_wait_itr -= 1;
    if (this.move_wait_itr <= 0) {
      let text: string = ""
      let x_pos: number = message.data['x']
      let y_pos: number = message.data['y']

      if (x_pos > this.x_pos_old) {
        text = "moved_right"
      }

      if (x_pos < this.x_pos_old) {
        text = "moved_left"
      }

      if (y_pos > this.y_pos_old) {
        text = "moved_down"
      }

      if (y_pos < this.y_pos_old) {
        text = "moved_up"
      }

      if (this.isRecordingStarted) {
        let moveAction: ActionModel = { type: text, x: x_pos, y: y_pos }
        this.recordings.push(moveAction)
        // console.log(moveAction)
      }

      this.x_pos_old = x_pos
      this.y_pos_old = y_pos
      this.move_wait_itr = 20
    }
  }

  scrollHandle(message: MessageEvent): void {
    this.scroll_wait_itr -= 1;
    if (this.scroll_wait_itr <= 0) {
      let text: string = ""
      let scroll_verticle = message.data['y_offset'];
      let scroll_horizontal = message.data['x_offset']

      if (scroll_verticle > this.current_y_pos) {
        text = 'scroll_down'
      }
      if (scroll_verticle < this.current_y_pos) {
        text = 'scroll_up';
      }

      if (scroll_horizontal > this.current_x_pos) {
        text = 'scroll_right';
      }
      if (scroll_horizontal < this.current_x_pos) {
        text = 'scroll_left'
      }

      if (this.isRecordingStarted) {
        let scrollAction: ActionModel = { type: text }
        this.recordings.push(scrollAction)
        // console.log(scrollAction)
      }

      this.current_y_pos = scroll_verticle;
      this.current_x_pos = scroll_horizontal;
      this.scroll_wait_itr = 5
    }
  }

  checkURL() {
    //disable history
    this.disableHistory()

    // this function checks if the iframe accessing sites from other origins and restricts
    if (this.iframe == null) {
      return
    }

    let iframe: HTMLIFrameElement = this.iframe.nativeElement // taking all html code displayed on the iframe at the moment
    try {
      this.lastSuccessfulURL = iframe.contentWindow?.location.pathname.substring(1)
    } catch (error) {
      // warns the user with the dialog prompt
      const dialogRef = this.dialog.open(CorsDialogComponent)
      dialogRef.afterClosed().subscribe(result => {
        if (this.lastSuccessfulURL != null)
          // redirects the user to the last successful URL and replaces history
          iframe.contentWindow?.location.replace(this.lastSuccessfulURL)
      });
    }
  }

  disableHistory() {
    history.pushState(null, document.title, location.href);
    window.addEventListener('popstate', function (event) {
      history.pushState(null, document.title, location.href);
    });
  }

  updateURL(url: string) {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}