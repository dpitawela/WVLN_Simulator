import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StoreModel } from '../types/model';

@Injectable({
  providedIn: 'root'
})

export class LambdaService {

  constructor(private httpClient: HttpClient) {

  }

  storeActions(model: StoreModel) {

    const func_url: string = "https://awf2ytltylqjubzeiqxticfpba0pbeuv.lambda-url.us-east-1.on.aws/"
    let payload: string = JSON.stringify(model)
    console.log(payload)
    // console.log(JSON.parse(payload))

    // this.httpClient.post<any>(func_url, payload).subscribe({
    //   next: data => {
    //     console.log(data);
    //   },
    //   error: error => {
    //     console.error(error);
    //   }
    // })
  }
}
