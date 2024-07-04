import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  BACKEND_API=environment.BACKEND_API;
  constructor(private http: HttpClient) { }

  createDatabase(name: string) {
    return this.http.post<boolean>(`${this.BACKEND_API}/v1/database`,{
      "name": name
    });
  }

}
