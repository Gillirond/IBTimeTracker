import {Injectable} from '@angular/core';
import { HttpClient} from '@angular/common/http';

@Injectable()
export class HttpService{
  constructor(private httpClient: HttpClient) {}

  postData(path: string, objToPost: Object) {
    return this.httpClient.post(path, objToPost).subscribe();
  }

  getData (path: string, callback) {
    //return this.httpClient.get('../assets/projectList.json').subscribe((data:string[]) => this.projectList = data);
    return this.httpClient.get(path).subscribe(callback);
  }
}
