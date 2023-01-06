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

    // result = ''
    return result != null ? JSON.parse(result) as StoreModel : null
  }
}