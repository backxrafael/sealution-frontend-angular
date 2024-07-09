import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  BACKEND_API=environment.BACKEND_API;
  constructor(private http: HttpClient) { }

  createInfluxDBOrganization(name: string, bucketName: string, userName: string) {
    return this.http.post<boolean>(`${this.BACKEND_API}/v1/influx/organization`,{
      "name": name,
      "bucket": {
        "name": bucketName
      },
      "user": {
        "name": userName
      }
    });
  }

}
