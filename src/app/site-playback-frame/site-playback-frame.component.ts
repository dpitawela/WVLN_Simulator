import { Component, DoCheck, ElementRef, EventEmitter, Input, KeyValueChangeRecord, KeyValueDiffer, KeyValueDiffers, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActionModel, StoreModel } from '../types/model';


@Component({
  selector: 'app-site-playback-frame',
  templateUrl: './site-playback-frame.component.html',
  styleUrls: ['./site-playback-frame.component.css']
})

export class SitePlaybackFrameComponent implements OnChanges, OnInit, DoCheck {
  url: SafeResourceUrl = '' // url bound to iframe
  strURL: string = '' // to have a string reference to current url
  historyStack: number[] = [];
  lastSuccessfulURL: string | undefined = ''
  errorPage: boolean = false

  @Input() retrievedActions: StoreModel = {} as StoreModel
  actions: ActionModel[] = []

  // in-component changes tracker
  differ: KeyValueDiffer<unknown, unknown>;

  // clicked item anchor/button/input
  clickedAnchor: HTMLElement | null = null;

  // play handle
  @Input() isPlaying: boolean = false
  @Output() isPlayingChange = new EventEmitter<boolean>();

  @Input() isPaused: boolean = false
  @Output() isPausedChange = new EventEmitter<boolean>();

  @Input() jumpNextStep: boolean = false
  @Output() jumpNextStepChange = new EventEmitter<boolean>();

  @Input() jumpPreviousStep: boolean = false
  @Output() jumpPreviousStepChange = new EventEmitter<boolean>();
  isJumpingBack = false

  iteration: number = -1;
  @Output() iterationUpdate = new EventEmitter<number>();
  @Output() nActions = new EventEmitter<number>();

  // to detect iframe
  @ViewChild('myframe') iframe: ElementRef | any;

  addDelay(ms: number) {
    return new Promise(res => setTimeout(res, ms));
  }

  constructor(private sanitizer: DomSanitizer, private differs: KeyValueDiffers) {
    this.differ = this.differs.find({ 'iteration': this.iteration }).create();
  }

  ngOnInit(): void {
    this.strURL = this.retrievedActions.url
    this.nActions.emit(this.retrievedActions.actions?.length)
  }

  async startPlaying() {
    if (this.retrievedActions.actions) {
      let oldContent: string | undefined;
      while (this.isPlaying && !this.isVideoEnded()) {

        if ((this.errorPage || this.isPageStillLoading(oldContent != null ? oldContent : '')) && this.iteration > -1) {
          oldContent = this.iframe.nativeElement.contentDocument?.body.innerHTML
          await this.addDelay(1000)
          continue
        }

        if (this.isPaused) {
          break
        }

        await this.playNextStep()
      }
    }
  }


  async playIteration() {
    if (this.retrievedActions.actions) {
      this.clickedAnchor = null
      let action: ActionModel = this.retrievedActions.actions[this.iteration]
      await this.addDelay(1000)

      await this.scrollToTheButton(action.x_offset ? action.x_offset : 0, action.y_offset ? action.y_offset : 0)
      await this.addDelay(2000)

      this.identifyTheElement(action.x ? action.x : 0, action.y ? action.y : 0, action.outer_html ? action.outer_html : '');
      await this.addDelay(500)

      this.clickHighlight();
      await this.addDelay(2000)

      await this.navigate()
      await this.addDelay(2000)
    }
  }

  // this method highlights all clickables
  identifyTheElement(x: number, y: number, clickedElementOuterHTML: string) {
    let iframe: HTMLIFrameElement = this.iframe.nativeElement // taking all html code displayed on the iframe at the moment
    if (iframe.contentDocument != null) {

      // identify user clicked element by outer html
      for (let type of ['a', 'input', 'button']) { // check if the clicked was either of these in the array
        let anchors: HTMLCollectionOf<any> = iframe.contentDocument.getElementsByTagName(type)
        for (let anchor of Array.from(anchors)) {
          
          let anchor_bounds = anchor.getBoundingClientRect()
          // if outer html is similar and x,y are closer to x,y captured by generator algorithm
          if (anchor.outerHTML == clickedElementOuterHTML && Math.abs(anchor_bounds.x - x) < 30 && Math.abs(anchor_bounds.y - y) < 30) {
            this.clickedAnchor = anchor
            if (this.clickedAnchor != null) // adding an id
              this.clickedAnchor.id = (this.clickedAnchor.id == '') ? 'clickedAnchor' : this.clickedAnchor.id
            break
          }
        }
      }

      // identify user clicked element by x, y coordinates
      if (this.clickedAnchor == null) {
        console.log("from points")
        this.clickedAnchor = iframe.contentDocument.elementFromPoint(x, y) as HTMLElement
      }
    }
  }

  async scrollToTheButton(x_offset: number, y_offset: number) {
    let iframe: HTMLIFrameElement = this.iframe.nativeElement // taking all html code displayed on the iframe at the moment

    if (iframe.contentDocument != null && iframe.contentWindow != null) {
      let oldContent: string = ''
      while (oldContent != iframe.contentDocument.body.innerHTML) { // if not scrolled to the position, repeat  
        oldContent = iframe.contentDocument.body.innerHTML
        iframe.contentWindow.scroll({ top: y_offset, left: x_offset, behavior: 'smooth' })
        await this.addDelay(700)
      }
    }
  }

  // this method highlights the link clicked
  async clickHighlight() {
    let iframe: HTMLIFrameElement = this.iframe.nativeElement // taking all html code displayed on the iframe at the moment
    if (this.clickedAnchor != null && iframe.contentDocument != null) {
      // adding styles to the anchor
      this.clickedAnchor.style.borderStyle = "solid"
      this.clickedAnchor.style.borderColor = '#ff4081'
      this.clickedAnchor.style.borderWidth = "3px"
      this.clickedAnchor.style.boxSizing = "border-box"
      this.clickedAnchor.style.backgroundColor = '#ff4081'

      // adding click animation
      this.clickedAnchor.appendChild(this.clickAnimation(iframe))
      await this.addDelay(400)
      // removing the added image for the animation
      iframe.contentDocument.getElementById('animatingImg')?.remove()
    }
  }
  clickAnimation(iframe: HTMLIFrameElement): HTMLImageElement {
    if (iframe.contentDocument != null) {
      let animatingImg: HTMLImageElement = iframe.contentDocument.createElement('img')
      animatingImg.src = "https://img.pikbest.com/png-images/20190917/black-mouse-click-effect-gif-element-dynamic-image_2515118.png!c1024wm0"

      // temporary style sheet for css animation
      const style = iframe.contentDocument.createElement('style');
      style.innerHTML = `
      .clickEffect {
        box-sizing: border-box;
        border-style: solid;
        border-color: black;
        border-radius: 50%;
        animation: clickEffect 0.5s ease-out;
        z-index: 99999;
    }
    
    @keyframes clickEffect {
        0% {
          opacity: 1;
          width: 0.5em;
          height: 0.5em;
          margin: -0.25em;
          border-width: 0.5em;
          display:flex;
        }
    
        100% {
          opacity: 0.2;
          width: 15em;
          height: 15em;
          margin: -7.5em;
          border- width: 0.03em;
          display:flex;
        }
    }
    `;

      iframe.contentDocument.head.appendChild(style);
      animatingImg.className = "clickEffect"
      animatingImg.id = 'animatingImg'
      return animatingImg
    }
    return new HTMLImageElement()
  }

  async navigate() {
    // forcing to open insinde the iframe 
    (this.clickedAnchor as HTMLAnchorElement).target = "_self";

    // clicks the element
    this.clickedAnchor?.click();

    // resetting anchor highlight styles
    this.clickedAnchor?.removeAttribute('style')

    // resetting anchor id
    if (this.clickedAnchor?.id == 'clickedAnchor')
      this.clickedAnchor.removeAttribute('id')
  }

  updateURL(relativeURL: string): void {
    // console.log("ori url:", relativeURL)
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(relativeURL);
  }

  async ngOnChanges(changes: SimpleChanges) {
    // console.log(changes)
    if (changes["isPlaying"] != null && changes["isPlaying"].currentValue && !this.jumpNextStep) {
      await this.startPlaying()
    } else if (changes["isPlaying"] != null && !changes["isPlaying"].currentValue) {
      this.resetPlay()
    } else if (changes["jumpNextStep"] != null && changes["jumpNextStep"].currentValue) {

      if (!this.isPlaying) {
        this.isPlayingChange.emit(true)
      }

      this.jumpNextStepChange.emit(true)
      this.isPausedChange.emit(false)
      await this.playNextStep()
      this.jumpNextStepChange.emit(false)
      this.isPausedChange.emit(true)

    } else if (changes["jumpPreviousStep"] != null && changes["jumpPreviousStep"].currentValue) {
      if (this.historyStack.length <= 2) {
        this.resetPlay()
        return
      }

      this.jumpPreviousStepChange.emit(true)
      this.isPausedChange.emit(false)
      this.isJumpingBack = true
      await this.playPreviousStep()
      this.jumpPreviousStepChange.emit(false)
      this.isPausedChange.emit(true)

    } else if (changes["isPaused"] != null && !changes["isPaused"].currentValue && !this.jumpNextStep && !this.jumpPreviousStep) {
      await this.startPlaying()
    }
  }

  addToHistory() {
    let iframe: HTMLIFrameElement = this.iframe.nativeElement // taking all html code displayed on the iframe at the moment
    try {
      if (this.isJumpingBack || this.iframe == null) {
        this.isJumpingBack = false
        return
      }

      this.lastSuccessfulURL = iframe.contentWindow?.location.pathname.substring(1)
      if (this.errorPage) {
        this.historyStack.push(this.iteration - 2)
        this.errorPage = false

      } else {
        this.historyStack.push(this.iteration - 1)
      }

      console.log(this.historyStack)

    } catch (error) {
      // if navigated to another origin
      this.errorPage = true
      if (this.lastSuccessfulURL != null) {
        // redirects the user to the last successful URL
        iframe.contentWindow?.location.replace(this.lastSuccessfulURL)
      }
    }
  }

  async playPreviousStep() {
    if (this.historyStack.length == 0)
      return

    let history: number | undefined = this.historyStack.pop()
    if (history != null)
      this.iteration = history

    let iframe: HTMLIFrameElement = this.iframe.nativeElement // taking all html code displayed on the iframe at the moment
    iframe.contentWindow?.history.back()
    console.log("history after back", this.historyStack)
  }

  async playNextStep() {
    this.errorPage = false
    this.iteration += 1
    await this.playIteration()
  }

  async resetPlay() {
    this.historyStack.splice(0)
    this.iteration = -1
    this.errorPage = false
    this.updateURL(this.retrievedActions.url)
    this.isPlayingChange.emit(false)
    this.isPausedChange.emit(false)
    this.jumpNextStepChange.emit(false)
    this.jumpPreviousStepChange.emit(false)
  }

  ngDoCheck(): void {
    const change = this.differ.diff({ 'iteration': this.iteration });
    if (change) {
      change.forEachChangedItem((item: KeyValueChangeRecord<any, any>) => {
        if (item.key == 'iteration') {
          console.log("currentitr", item.currentValue)
          this.iterationUpdate.emit(item.currentValue)
        }
      });
    }
  }

  isVideoEnded(): boolean {
    if (this.retrievedActions.actions)
      return this.retrievedActions.actions.length == this.iteration + 1
    return true
  }

  isPageStillLoading(oldContent: string) {
    let iframe: HTMLIFrameElement = this.iframe.nativeElement
    return oldContent != iframe.contentDocument?.body.innerHTML
  }
}
