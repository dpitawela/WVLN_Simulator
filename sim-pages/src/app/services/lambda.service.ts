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

    const func_url: string = "https://awf2ytltylqjubzeiqxticfpba0pbeuv.lambda-url.us-east-1.on.aws/"
    let payload: string = JSON.stringify(model)
    console.log(payload)

    // await lastValueFrom(this.httpClient.post<any>(func_url, payload)).then((data: any) => {
    //   result = data.successToken
    // }).catch((error) => {
    //   console.log(error)
    // })

    console.log(result)
    return result
  }
}