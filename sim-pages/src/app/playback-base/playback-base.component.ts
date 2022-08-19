import { Component } from '@angular/core';
import { ActionModel, StoreModel } from '../types/model';
import { Buffer } from 'buffer';

@Component({
  selector: 'app-playback-base',
  templateUrl: './playback-base.component.html',
  styleUrls: ['./playback-base.component.css']
})
export class PlaybackBaseComponent {
  retrievedActions: StoreModel
  isPlaying: boolean = false

  constructor() {
    let strObject: string = '{"url":"assets/crawled/hansel/hanselfrombasel.com/index.html","actions":[{"type":"click","x_pos":684,"y_pos":569,"href":"collections/womens-new-arrivals.html","outer_html":"PGEgaHJlZj0iY29sbGVjdGlvbnMvd29tZW5zLW5ldy1hcnJpdmFscy5odG1sIiBjbGFzcz0iYnV0dG9uCiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbi1tZWRpdW0KICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uLXdoaXRlCiAgICAgICAgICAgICAgICAgICAgICAgIHR4dC1zaXplLTIKICAgICAgICAgICAgICAgICAgICAgICAgdHh0LXRyYWNrZWQtdHdvLXBvaW50Ij4KICAgICAgICAgICAgICAgICBTaG9wIE5ldyBBcnJpdmFscwogICAgICAgICAgICAgIDwvYT4="},{"type":"click","x_pos":79,"y_pos":174,"href":"womens.html","outer_html":"PGEgaHJlZj0id29tZW5zLmh0bWwiIGNsYXNzPSJzaWRlbmF2LWxpbmsKICAgICAgICAgICAgICAiPgogICAgICBTaG9wIEFsbAogICAgICAKICAgICAgCiAgICA8L2E+"},{"type":"click","x_pos":664,"y_pos":328,"href":"womens/products/leona-dress-navy.html","outer_html":"PGEgaHJlZj0id29tZW5zL3Byb2R1Y3RzL2xlb25hLWRyZXNzLW5hdnkuaHRtbCI+CiAgICAKICAgIAogICAgICAKICAgICAgICAKICAgICAgICA8aW1nIHNyYz0iLi4vLi4vY2RuLnNob3BpZnkuY29tL3MvZmlsZXMvMS8wNzgwLzQ5OTEvcHJvZHVjdHMvaGZiXzExMDE4OWJfbGVvbmFfZHJlc3NfbmF2eS0yNzk0XzEwMjR4MTAyNGVlODguanBnP3Y9MTY0Njc4MDQxMCIgYWx0PSJuYXZ5IiBkYXRhLXZhcmlhbnQtaWQ9IjQwMTE2OTYzMzExNjYzIiBjbGFzcz0icHJvZHVjdC1jYXJkLWltYWdlCiAgICAgICAgICAgICAgICAgICAganMtdmFyaWFudC1zd2l0Y2hlcgogICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICBpcy1hY3RpdmUKICAgICAgICAgICAgICAgICAgICAiPgogICAgICAKICAgICAgICAKICAgICAgICA8aW1nIHNyYz0iLi4vLi4vY2RuLnNob3BpZnkuY29tL3MvZmlsZXMvMS8wNzgwLzQ5OTEvcHJvZHVjdHMvaGZiXzExMDE4OWJfbGVvbmFfZHJlc3NfbmF2eS0yNzk0XzEwMjR4MTAyNGVlODguanBnP3Y9MTY0Njc4MDQxMCIgYWx0PSJuYXZ5IiBkYXRhLXZhcmlhbnQtaWQ9IjQwMTE2OTYzNTQxMDM5IiBjbGFzcz0icHJvZHVjdC1jYXJkLWltYWdlCiAgICAgICAgICAgICAgICAgICAganMtdmFyaWFudC1zd2l0Y2hlcgogICAgICAgICAgICAgICAgICAgICI+CiAgICAgIAogICAgICAgIAogICAgICAgIDxpbWcgc3JjPSIuLi8uLi9jZG4uc2hvcGlmeS5jb20vcy9maWxlcy8xLzA3ODAvNDk5MS9wcm9kdWN0cy9oZmJfMTEwMTg5Yl9sZW9uYV9kcmVzc19uYXZ5LTI3OTRfMTAyNHgxMDI0ZWU4OC5qcGc/dj0xNjQ2NzgwNDEwIiBhbHQ9Im5hdnkiIGRhdGEtdmFyaWFudC1pZD0iNDAxMTY5NjM2MDY1NzUiIGNsYXNzPSJwcm9kdWN0LWNhcmQtaW1hZ2UKICAgICAgICAgICAgICAgICAgICBqcy12YXJpYW50LXN3aXRjaGVyCiAgICAgICAgICAgICAgICAgICAgIj4KICAgICAgCiAgICAKICA8L2E+"}]}'
   
    this.retrievedActions = JSON.parse(strObject) as StoreModel
    // converting html from base64 to binary in all click actions
    if (this.retrievedActions.actions)
      for (let action of this.retrievedActions.actions) {
        if (action.type == 'click' && action.outer_html) {
          action.outer_html = Buffer.from(action.outer_html, 'base64').toString('binary')
        }
      }

    console.log("received object:", this.retrievedActions)
    // '//*[@id="shopify-section-hero"]/div[1]/div/div/div/div/div/a'
  }
}