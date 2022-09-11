import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StoreModel } from '../types/model';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LambdaService {

  constructor(private httpClient: HttpClient) {
  }

  async storeActions(model: StoreModel): Promise<string> {
    let result: string = ''

    const func_url: string = "https://panjwnqvwtp2z7trs7gj2giw7e0beqds.lambda-url.ap-southeast-2.on.aws/"
    let payload: string = JSON.stringify(model)
    console.log(payload)

    await lastValueFrom(this.httpClient.post<any>(func_url, payload)).then((data: any) => {
      result = data.successToken
    }).catch((error) => {
      console.log(error)
    })

    console.log("recorded")
    return result
  }


  async readActions(token: string): Promise<StoreModel | null> {
    let result: string | null = null

    if (token != '' && token.startsWith('R_')) {
      const func_url: string = "https://mbagrtl5aac2do7n72zn3xae3m0uowbu.lambda-url.ap-southeast-2.on.aws/"
      let payload: string = JSON.stringify(token)

      await lastValueFrom(this.httpClient.post<string>(func_url, payload)).then((data: string) => {
        result = data
      }).catch((error) => {
        console.log(error)
      })
    }

    // dummy data
    // result =
    //'{ "url": "assets/crawled/hansel/hanselfrombasel.com/index.html", "actions": [{ "type": "click", "x": 289.8125, "y": 551.03125, "height": 47.78125, "width": 223.375, "x_offset": 0, "y_offset": 0, "href": "collections/womens-new-arrivals.html", "outer_html": "PGEgaHJlZj0iY29sbGVjdGlvbnMvd29tZW5zLW5ldy1hcnJpdmFscy5odG1sIiBjbGFzcz0iYnV0dG9uCiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbi1tZWRpdW0KICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uLXdoaXRlCiAgICAgICAgICAgICAgICAgICAgICAgIHR4dC1zaXplLTIKICAgICAgICAgICAgICAgICAgICAgICAgdHh0LXRyYWNrZWQtdHdvLXBvaW50Ij4KICAgICAgICAgICAgICAgICBTaG9wIE5ldyBBcnJpdmFscwogICAgICAgICAgICAgIDwvYT4=" }] }'
    // '{"url":"assets/crawled/hansel/hanselfrombasel.com/index.html","actions":[{"type":"click","x":283.8125,"y":551.03125,"height":47.78125,"width":223.375,"x_offset":0,"y_offset":0,"href":"collections/womens-new-arrivals.html","outer_html":"PGEgaHJlZj0iY29sbGVjdGlvbnMvd29tZW5zLW5ldy1hcnJpdmFscy5odG1sIiBjbGFzcz0iYnV0dG9uCiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbi1tZWRpdW0KICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uLXdoaXRlCiAgICAgICAgICAgICAgICAgICAgICAgIHR4dC1zaXplLTIKICAgICAgICAgICAgICAgICAgICAgICAgdHh0LXRyYWNrZWQtdHdvLXBvaW50Ij4KICAgICAgICAgICAgICAgICBTaG9wIE5ldyBBcnJpdmFscwogICAgICAgICAgICAgIDwvYT4="},{"type":"click","x":408.0625,"y":337.796875,"height":219.46875,"width":164.609375,"x_offset":0,"y_offset":0,"href":"womens-new-arrivals/products/love-mother-earth-short-crew.html","outer_html":"PGEgaHJlZj0id29tZW5zLW5ldy1hcnJpdmFscy9wcm9kdWN0cy9sb3ZlLW1vdGhlci1lYXJ0aC1zaG9ydC1jcmV3Lmh0bWwiPgogICAgPGltZyBjbGFzcz0iYnVuZGxlLWJhZGdlIiBzcmM9Ii4uLy4uL2Nkbi5zaG9waWZ5LmNvbS9zL2ZpbGVzLzEvMDc4MC80OTkxL3QvMjcvYXNzZXRzL2J1bmRsZV9hbmRfc2F2ZV80NTB4NDMzZjVkMS5wbmc/dj0xMjI2MTU5NzY1OTg5MDA2MDUzMTE2MjMwODkwNzkiPgogICAgCiAgICAgIDxpbWcgc3JjPSIuLi8uLi9jZG4uc2hvcGlmeS5jb20vcy9maWxlcy8xLzA3ODAvNDk5MS9wcm9kdWN0cy9oZmJfMTEwOTY5X2xvdmVfbW90aGVyX2VhcnRoX2NyZXdfbXVzaHJvb21fMTAyNHgxMDI0NmE4ZS5qcGc/dj0xNjUwNDMyNjk5IiBhbHQ9Im11c2hyb29tIiBjbGFzcz0icHJvZHVjdC1jYXJkLWltYWdlIGlzLWFjdGl2ZSI+CiAgICAKICA8L2E+"}]}'

    return result != null ? JSON.parse(result) as StoreModel : null
  }
}