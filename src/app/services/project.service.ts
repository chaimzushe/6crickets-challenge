import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  baseAPI = '';//"env--based-url";
  constructor(private httpClient: HttpClient) { }

  getProjectDeadLine(){
    if(!this.baseAPI){
      return of({ secondsLeft: 3600 });
    } else {
      const url = `${this.baseAPI}/api/deadline`;
      return this.httpClient.get<{ secondsLeft: number }>(url)
    }

  }
}
