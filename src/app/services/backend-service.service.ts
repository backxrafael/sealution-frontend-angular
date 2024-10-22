import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Registration } from '../../types/registration';
import { environment } from '../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { fetchAuthSession } from 'aws-amplify/auth';
import { CreateRegistration } from '../create-registration/create-registration';
import { AccessToken } from '../../types/accessToken';
import * as sentry from '@sentry/angular';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  BACKEND_API = environment.BACKEND_API;
  constructor(private http: HttpClient) { }
  handleError(error: HttpErrorResponse) {
    // Return an observable with a user-facing error message.
    return throwError(() => new Error(error.message));
  }

  async getUserGroup() {
    const { accessToken, } = await this.getTokens();
    const groups = accessToken?.payload['cognito:groups']
    return groups;
  }

  async getTokens() {
    try {
      const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
      return { accessToken, idToken }
    } catch (error) {
      sentry.captureException(error);
      return {};
    }
  }

  async createRegistrationRequest(registrationRequest: CreateRegistration) {
    const {accessToken, idToken } = await this.getTokens();
    return this.http.post<Registration>(`${this.BACKEND_API}/v1/register`, 
    {
      shipId: registrationRequest.shipId
    },
    {
      headers: {
        'Authorization': `${accessToken}`,
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }

  async getRegistrationStatus(shipId: string) {
    const {accessToken, idToken } = await this.getTokens();
    return this.http.get<Registration>(`${this.BACKEND_API}/v1/register/status/${shipId}`, {
      headers: {
        'Authorization': `${accessToken}`,
      }
    }).pipe(catchError(this.handleError));
  }

  async getRegistrations() {
    const {accessToken, idToken } = await this.getTokens();
    return this.http.get<Registration[]>(`${this.BACKEND_API}/v1/register/status`, {
      headers: {
        'Authorization': `${accessToken}`,
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }

  async resetRegistration(registration: Registration) {
    const {accessToken, idToken } = await this.getTokens();
    return this.http.post<Registration>(`${this.BACKEND_API}/v1/register/reset/${registration.shipId}`, {}, {
      headers: {
         'Authorization': `${accessToken}`
      }
    }).pipe(catchError(this.handleError));
  }
  
  async revokeCertificate(registration: Registration) {
    const {accessToken, idToken } = await this.getTokens();
    return this.http.put<Registration>(`${this.BACKEND_API}/v1/register/revoke/${registration.shipId}`, {}, {
      headers: {
         'Authorization': `${accessToken}`
      }
    }).pipe(catchError(this.handleError));
  }

  async denyRegistration(registration: Registration) {
    const {accessToken, idToken } = await this.getTokens();
    return this.http.put<Registration>(`${this.BACKEND_API}/v1/register/deny/${registration.shipId}`, {}, {
      headers: {
         'Authorization': `${accessToken}`
      }
    }).pipe(catchError(this.handleError));
  }

  async acceptRegistration(registration: Registration) {
    const {accessToken, idToken } = await this.getTokens();
    const data = {
      shipName: registration.shipName,
      clientName: registration.clientName
    }
    return this.http.post(`${this.BACKEND_API}/v1/register/accept/${registration.shipId}`, 
      data, 
      {
      headers: {
        'Authorization': `${accessToken}`,
        'Content-Type': 'application/json'
      },
    }).pipe(catchError(this.handleError));
  }

  async createInfluxDBOrganization(name: string, bucketName: string, userName: string) {
    const {accessToken, idToken } = await this.getTokens();
    const data = {
      name: name,
      bucket: {
        name: bucketName
      },
    }
    return this.http.post<boolean>(`${this.BACKEND_API}/v1/influx/organization`,
      data,
      {
        headers: {
          'Authorization': `${accessToken}`,
          'Content-Type': 'application/json'
        },
      }).pipe(catchError(this.handleError));
  }

  async createAccessToken(valid: boolean) {
    const {accessToken, idToken } = await this.getTokens();
    return this.http.post(`${this.BACKEND_API}/v1/accesstoken`, 
    {
      valid
    },
    {
      headers: {
        'Authorization': `${accessToken}`,
        'Content-Type': 'application/json'
      },
    }).pipe(catchError(this.handleError))
  }
  
  async getAccessTokens() : Promise<Observable<AccessToken[]>> {
    const {accessToken, idToken } = await this.getTokens();
    return this.http.get<AccessToken[]>(`${this.BACKEND_API}/v1/accesstoken`,
    {
      headers: {
        'Authorization': `${accessToken}`,
      },
    }).pipe(catchError(this.handleError))
  }

  async validateAccessToken(id: number) {
    const {accessToken, idToken } = await this.getTokens();
    return this.http.put(`${this.BACKEND_API}/v1/accesstoken/validate/${id}`, {},
    {
      headers: {
        'Authorization': `${accessToken}`,
      },
    }).pipe(catchError(this.handleError))
  }

  async invalidateAccessToken(id: number) {
    const {accessToken, idToken } = await this.getTokens();
    return this.http.put(`${this.BACKEND_API}/v1/accesstoken/invalidate/${id}`, {},
    {
      headers: {
        'Authorization': `${accessToken}`,
      },
    }).pipe(catchError(this.handleError))
  }
  
  async deleteAccessToken(id: number) {
    const {accessToken, idToken } = await this.getTokens();
    return this.http.delete(`${this.BACKEND_API}/v1/accesstoken/${id}`,
    {
      headers: {
        'Authorization': `${accessToken}`,
      },
    }).pipe(catchError(this.handleError))
  }
}
