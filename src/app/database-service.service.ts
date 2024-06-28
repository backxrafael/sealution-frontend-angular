import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  BACKEND_URL=environment.BACKEND_URL;
  constructor(private http: HttpClient) { }

  createDatabase(name: string) {
    return this.http.post<boolean>(`${this.BACKEND_URL}/v1/database`,{
      "name": name
    });
  }

}
