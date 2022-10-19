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

    // await lastValueFrom(this.httpClient.post<any>(func_url, payload)).then((data: any) => {
    //   result = data.successToken
    // }).catch((error) => {
    //   console.log(error)
    // })

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


    result =
    '{"url": "assets/crawled/hansel/hanselfrombasel.com/index.html", "actions": [{"type": "click", "x": 349.765625, "y": 720.0, "height": 0, "width": 0, "x_offset": 0, "y_offset": 516.34375, "href": "#", "outer_html": "PGEgaHJlZj0iIyI+CiAgICAgICAgICAgICAgCiAgICAgICAgICAgIDwvYT4="}, {"type": "click", "x": 14, "y": 52.171875, "height": 41, "width": 775, "x_offset": 0, "y_offset": 0, "href": "collections/mens.html", "outer_html": "PGEgaHJlZj0iY29sbGVjdGlvbnMvbWVucy5odG1sIiBjbGFzcz0idG9wbmF2LW1vYmlsZS1saW5rIiBpZD0ibmF2LW1haW4tbWVucyIgYWx0PSJNZW4ncyI+CiAgICAgICAgICAgIE1lbidzCiAgICAgIAkgIDwvYT4="}, {"type": "click", "x": 478.96875, "y": 68.96875, "height": 16, "width": 69, "x_offset": 0, "y_offset": 0, "href": "collections/kids-new-arrivals.html", "outer_html": "PGEgaHJlZj0iY29sbGVjdGlvbnMva2lkcy1uZXctYXJyaXZhbHMuaHRtbCI+CiAgICAgICAgICAgICAgU2hvcCBOb3cKICAgICAgICAgICAgPC9hPg=="}, {"type": "click", "x": 705.84375, "y": 85.953125, "height": 21, "width": 35, "x_offset": 0, "y_offset": 0, "href": "search.html", "outer_html": "PGEgaHJlZj0ic2VhcmNoLmh0bWwiIGNsYXNzPSJuYXYtbGluawogICAgICAgICAgICAgICAgbmF2LWxpbmstbW9iaWxlIj4KICAgICAgICA8IS0tP3htbCB2ZXJzaW9uPSIxLjAiIGVuY29kaW5nPSJ1dGYtOCI/LS0+CjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOC4xLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGNsYXNzPSJpY29uIGljb24tc2VhcmNoIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDIwIDIwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAyMCAyMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPHBhdGggZD0iTTYuNiw3LjVjMC4zLDAuMSwwLjUsMC40LDAuNywwLjZjMC4zLDAuMiwwLjUsMC41LDAuOCwwLjdjMC4yLTAuMiwwLjQtMC40LDAuNi0wLjZDOC41LDcuOSw4LjEsNy42LDcuOCw3LjMKCQlDNy43LDcuMiw3LjQsNi45LDcuMyw2LjlDNy4xLDcsNi43LDcuMyw2LjYsNy41Ij48L3BhdGg+Cgk8Zz4KCQk8cGF0aCBkPSJNMi44LDIuN2MwLjYtMC4yLDAsMC41LTAuMiwwLjljLTAuMiwwLjMtMC4yLDAuNy0wLjIsMWMwLDAuNywwLjIsMS4zLDAuNywxLjhjMSwxLjEsMi42LDAuOCwzLjYtMC4yCgkJCWMwLjUtMC41LDAuOC0xLjEsMC45LTEuOGMwLTAuOC0wLjItMS4zLTAuOC0xLjhDNS43LDEuNyw0LDIuMiwzLDNDMi43LDMuMiwyLjcsMy41LDIuNCwzLjNDMi4yLDMuMiwyLDIuNiwyLjEsMi40CgkJCWMwLjItMC41LDEuMS0xLDEuNi0xLjFDNC4xLDEuMSw0LjQsMS4xLDQuOCwxYzAuNCwwLDAuNywwLDEuMSwwLjFjMC40LDAuMSwwLjcsMC4xLDEsMC40QzcuMiwxLjcsNy40LDEuOCw3LjcsMgoJCQlDOCwyLjIsOC4xLDIuNiw4LjMsMi45YzAuMiwwLjMsMC4zLDAuNiwwLjQsMWMwLjEsMC44LDAsMS42LTAuNCwyLjNDNy45LDYuNyw3LjUsNy4yLDYuOSw3LjZDNi4zLDgsNS41LDgsNC44LDguMQoJCQljLTAuNywwLTEuMywwLTEuOS0wLjNDMi4zLDcuNSwyLDcsMS43LDYuNUMxLjMsNiwxLjEsNS4zLDEuMiw0LjZDMS4zLDQuMSwxLjQsMy41LDEuNiwzYzAuMS0wLjIsMC41LTAuOSwwLjctMC45CgkJCUMyLjUsMiwyLjYsMi44LDIuOCwyLjd6Ij48L3BhdGg+CgkJPHBhdGggZD0iTTkuNiwxMC44YzAuNCwwLjQsMC44LDAuOSwxLjIsMS4zYzAuOCwwLjksMS42LDEuNywyLjQsMi41YzAuNCwwLjQsMC43LDAuNywxLjEsMS4xYzAuNCwwLjQsMC43LDAuOCwxLjEsMS4yCgkJCWMwLjIsMC4yLDEsMSwxLjEsMC45YzAuMS0wLjEsMC40LTAuNCwwLjUtMC41YzAuMi0wLjIsMC4zLTAuMiwwLjQtMC41Yy0xLTAuOS0xLjktMi0yLjgtM2MtMC44LTAuOC0xLjYtMS42LTIuNC0yLjQKCQkJYy0wLjUtMC41LTEtMS0xLjQtMS42Yy0wLjQtMC41LTEtMC45LTEuNC0xLjRDOC44LDguNiw4LjYsOS4yLDguMSw5LjVDNy45LDkuNCw3LjUsOSw3LjYsOC44QzcuNyw4LjcsOCw4LjUsOC4xLDguNAoJCQljMC4yLTAuMiwwLjktMS4xLDEuMi0xLjFjMC4xLDAsMC41LDAuNSwwLjYsMC42YzAuMiwwLjMsMC41LDAuNSwwLjcsMC44YzAuNCwwLjQsMC43LDAuOCwxLjEsMS4yYzAuMiwwLjIsMC40LDAuNCwwLjUsMC42CgkJCWMwLjIsMC4zLDAuNSwwLjUsMC43LDAuN2MwLjQsMC40LDAuOSwwLjgsMS4zLDEuM2MwLjIsMC4yLDAuNCwwLjUsMC43LDAuN2MwLjIsMC4yLDAuNSwwLjMsMC43LDAuNmMwLjQsMC41LDAuOSwwLjgsMS4yLDEuMwoJCQljMC42LDAuNywxLjMsMS4yLDEuOCwxLjljLTAuNCwwLjQtMC45LDAuOC0xLjIsMS4xYy0wLjMsMC4yLTAuOSwxLjItMS4yLDFjLTAuMy0wLjItMC40LTAuNC0wLjUtMC42Yy0wLjItMC4yLTAuNC0wLjMtMC41LTAuNQoJCQljLTAuNC0wLjQtMC44LTAuOS0xLjItMS4zYy0wLjUtMC41LTAuOC0wLjgtMS4yLTEuM2MtMC4yLTAuMi0wLjQtMC40LTAuNi0wLjZjLTAuMi0wLjItMC40LTAuNS0wLjctMC43Yy0wLjgtMC44LTEuNy0xLjYtMi40LTIuNQoJCQljLTAuMi0wLjMtMC42LTAuOC0wLjktMUM3LjksMTAsOCwxMC4xLDcuNyw5LjhDNy42LDkuNyw3LjQsOS42LDcuMyw5LjVjLTAuMi0wLjQsMC40LTEsMC44LTAuNGMwLjIsMC4zLDAuNCwwLjQsMC42LDAuNwoJCQlDOC45LDEwLjEsOS4zLDEwLjUsOS42LDEwLjh6Ij48L3BhdGg+Cgk8L2c+Cgk8cGF0aCBkPSJNNy45LDguNWMwLDAuMS0wLjEsMC4xLTAuMiwwLjFjLTAuMSwwLTAuMSwwLjEtMC4yLDAuMUM3LjUsOC45LDcuNCw5LDcuMyw5LjFjMCwwLTAuMSwwLjEtMC4xLDAuMWMwLDAsMC4xLDAuMSwwLjEsMC4yCgkJYzAsMCwwLDAuMSwwLjEsMC4xYzAsMC4xLDAuMSwwLDAuMSwwQzcuNiw5LjIsNy44LDksOCw4LjhDOCw4LjgsOC4xLDguNyw4LDguNkM4LDguNiw4LDguNSw3LjksOC41QzgsOC41LDcuOSw4LjUsNy45LDguNSI+PC9wYXRoPgo8L2c+Cjwvc3ZnPgoKICAgICAgPC9hPg=="}]}'
    return result != null ? JSON.parse(result) as StoreModel : null
  }
}