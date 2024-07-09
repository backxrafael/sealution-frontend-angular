import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Registration } from '../registration/registration';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { fetchAuthSession, } from 'aws-amplify/auth';
import { CreateRegistration } from '../create-registration/create-registration';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  AUTHENTICATOR_API = environment.AUTHENTICATOR_API;
  constructor(private http: HttpClient) { }

  async getTokens() {
    try {
      const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
      return { accessToken, idToken }
    } catch (error) {
      console.log(error);
      return {};
    }
  }

  async createRegistrationRequest(registrationRequest: CreateRegistration) {
    const {accessToken, idToken } = await this.getTokens();
    return this.http.post<Registration>(`${this.AUTHENTICATOR_API}/v1/register`, 
    {
      shipId: registrationRequest.shipId
    },
    {
      headers: {
        'Authorization': `${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async getRegistrationStatus(shipId: string) {
    const {accessToken, idToken } = await this.getTokens();
    return this.http.get<Registration>(`${this.AUTHENTICATOR_API}/v1/register/status/${shipId}`, {
      headers: {
        'Authorization': `${accessToken}`,
      }
    });
  }

  async getRegistrations() : Promise<Observable<Registration[]>> {
    const {accessToken, idToken } = await this.getTokens();
    return this.http.get<Registration[]>(`${this.AUTHENTICATOR_API}/v1/register/status`, {
      headers: {
        'Authorization': `${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async denyRegistration(registration: Registration) {
    const {accessToken, idToken } = await this.getTokens();
    return this.http.put<Registration>(`${this.AUTHENTICATOR_API}/v1/register/deny/${registration.shipId}`, {}, {
      headers: {
         'Authorization': `${accessToken}`
      }
    })
  }

  async acceptRegistration(registration: Registration) {
    const {accessToken, idToken } = await this.getTokens();
    const data = {
      shipName: registration.shipName,
      clientName: registration.clientName
    }
    return this.http.post(`${this.AUTHENTICATOR_API}/v1/register/accept/${registration.shipId}`, 
      data, 
      {
      headers: {
        'Authorization': `${accessToken}`,
        'Content-Type': 'application/json'
      },
    })
  }
}
