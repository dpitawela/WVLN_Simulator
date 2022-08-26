import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActionModel, StoreModel } from '../types/model';


@Component({
  selector: 'app-site-playback-frame',
  templateUrl: './site-playback-frame.component.html',
  styleUrls: ['./site-playback-frame.component.css']
})

export class SitePlaybackFrameComponent implements OnChanges, OnInit {
  url: SafeResourceUrl = '' // url bound to iframe
  strURL: string = '' // to have a string reference to current url
  @Input() retrievedActions: StoreModel = {} as StoreModel
  @Input() isPlaying: boolean = false
  @Output() isPlayingChange = new EventEmitter<boolean>();
  @Input() isPaused: boolean = false
  @Output() isPausedChange = new EventEmitter<boolean>();
  actions: ActionModel[] = []

  // anchor tag/button colours/attributes
  clickedAnchor: HTMLElement | null = null;

  // play handle
  iteration: number = 0

  addDelay(ms: number) {
    return new Promise(res => setTimeout(res, ms));
  }

  // to detect iframe
  @ViewChild('myframe') iframe: ElementRef | any;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.strURL = this.retrievedActions.url
    // console.log(this.strURL)
    this.updateURL(this.strURL)
  }

  async startPlaying() {
    if (this.iteration != 0) {
      this.updateURL(this.retrievedActions.url)
      this.iteration = 0
    }
    if (this.retrievedActions.actions)
      while (this.isPlaying && this.retrievedActions.actions.length > this.iteration) {
        if (this.isPaused) {
          // await this.addDelay(500)
          // continue
          break
        }
        await this.playIteration()
      }

    this.isPlayingChange.emit(false);
    this.isPausedChange.emit(false);
  }


  async playIteration() {
    if (this.retrievedActions.actions) {
      let action: ActionModel = this.retrievedActions.actions[this.iteration]
      await this.addDelay(1000)
      this.highlightClickables(action.outer_html ? action.outer_html : '');
      await this.addDelay(2000)
      this.scrollToTheButton()
      await this.addDelay(1000)

      this.clickHighlight();
      await this.addDelay(2000)
      this.navigate(action.href ? action.href : '')

      this.iteration += 1
    }
  }

  // this method highlights all clickables
  highlightClickables(clickedElementOuterHTML: string) {
    let iframe: HTMLIFrameElement = this.iframe.nativeElement // taking all html code displayed on the iframe at the moment
    if (iframe.contentDocument != null) {

      for (let type of ['a', 'input', 'button']) { // check if the clicked was either of these in the array
        let anchors: HTMLCollectionOf<any> = iframe.contentDocument.getElementsByTagName(type)
        for (let anchor of Array.from(anchors)) {
          if (anchor.outerHTML == clickedElementOuterHTML) {
            this.clickedAnchor = anchor
            if (this.clickedAnchor != null) // adding an id
              this.clickedAnchor.id = (this.clickedAnchor.id == '') ? 'clickedAnchor' : this.clickedAnchor.id
          }
          // anchor.style.borderStyle = "solid"
          // anchor.style.borderColor = "#3f51b5"
        }
      }
    }
  }

  scrollToTheButton() {
    let iframe: HTMLIFrameElement = this.iframe.nativeElement // taking all html code displayed on the iframe at the moment
    if (iframe.contentDocument != null)
      this.clickedAnchor?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }

  // this method highlights the link clicked
  async clickHighlight() {
    let iframe: HTMLIFrameElement = this.iframe.nativeElement // taking all html code displayed on the iframe at the moment
    if (this.clickedAnchor != null && iframe.contentDocument != null) {
      // adding styles to the anchor
      this.clickedAnchor.style.borderStyle = "solid"
      this.clickedAnchor.style.borderColor = '#ff4081'
      this.clickedAnchor.style.borderWidth = "5px"
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

  navigate(relativeURL: string) {

    // this.strURL = (this.clickedAnchor as HTMLAnchorElement).href
    this.clickedAnchor?.click()

    // if (this.clickedAnchor?.className.includes('nav')) {
    //   this.clickedAnchor?.click()
    //   // if (this.clickedAnchor?.href != '#') {
    //   //   this.strURL = this.clickedAnchor?.href
    //   // }
    // } else {
    //   this.updateURL(relativeURL)
    // }

    // resetting anchor id
    if (this.clickedAnchor?.id == 'clickedAnchor')
      this.clickedAnchor.removeAttribute('id')
  }

  updateURL(relativeURL: string): void {
    // console.log("ori url:", relativeURL)
    let currentURLParts: string[] = this.strURL.split('/')
    if (relativeURL.startsWith('.')) {
      // console.log("with dot:")
      this.strURL = currentURLParts.slice(0, -2).join('/') + relativeURL.substring(2)
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.strURL);
      // console.log(this.strURL)

    } else if (relativeURL.startsWith('assets')) { // index page
      console.log(relativeURL)
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(relativeURL);

    } else { // if new relative url is a forward from current page
      this.strURL = currentURLParts.slice(0, -1).join('/') + '/' + relativeURL
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.strURL);
      // console.log("Relative link", this.strURL)
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isPlaying'].currentValue) {
      this.startPlaying()
    }
  }
}
