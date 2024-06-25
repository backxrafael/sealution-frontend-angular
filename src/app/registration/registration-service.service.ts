import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Registration } from './registration';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  BACKEND_URL = 'https://x1meyglje1.execute-api.eu-west-1.amazonaws.com/dev';
  API_KEY = '}849deH{BMaNw}f]11fCs[R+z%4ECP)Z';
  constructor(private http: HttpClient) { }
  getRegistrations() {
    return this.http.get<Registration[]>(`${this.BACKEND_URL}/v1/register/status`, {
      headers: {
        'Authorization': this.API_KEY
      }
    });
  }

  denyRegistration(registration: Registration) {
    return this.http.put<Registration>(`${this.BACKEND_URL}/v1/register/deny/${registration.shipId}`, {}, {
      headers: {
        'Authorization': this.API_KEY
      }
    })
  }

  acceptRegistration(registration: Registration) {
    return this.http.put<Registration>(`${this.BACKEND_URL}/v1/register/accept/${registration.shipId}`, {}, {
      headers: {
        'Authorization': this.API_KEY
      }
    })
  }
}
