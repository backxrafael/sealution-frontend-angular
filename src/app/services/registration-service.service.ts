import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Registration } from '../registration/registration';
import { environment } from '../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { fetchAuthSession, } from 'aws-amplify/auth';
import { CreateRegistration } from '../create-registration/create-registration';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  AUTHENTICATOR_API = environment.AUTHENTICATOR_API;
  constructor(private http: HttpClient) { }
  handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

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
    }).pipe(catchError(this.handleError));
  }

  async getRegistrationStatus(shipId: string) {
    const {accessToken, idToken } = await this.getTokens();
    return this.http.get<Registration>(`${this.AUTHENTICATOR_API}/v1/register/status/${shipId}`, {
      headers: {
        'Authorization': `${accessToken}`,
      }
    }).pipe(catchError(this.handleError));
  }

  async getRegistrations() : Promise<Observable<Registration[]>> {
    const {accessToken, idToken } = await this.getTokens();
    return this.http.get<Registration[]>(`${this.AUTHENTICATOR_API}/v1/register/status`, {
      headers: {
        'Authorization': `${accessToken}`,
        'Content-Type': 'application/json'
      }
    }).pipe(catchError(this.handleError));
  }

  async resetRegistration(registration: Registration) {
    const {accessToken, idToken } = await this.getTokens();
    return this.http.post<Registration>(`${this.AUTHENTICATOR_API}/v1/register/reset/${registration.shipId}`, {}, {
      headers: {
         'Authorization': `${accessToken}`
      }
    }).pipe(catchError(this.handleError));
  }

  async denyRegistration(registration: Registration) {
    const {accessToken, idToken } = await this.getTokens();
    return this.http.put<Registration>(`${this.AUTHENTICATOR_API}/v1/register/deny/${registration.shipId}`, {}, {
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
    return this.http.post(`${this.AUTHENTICATOR_API}/v1/register/accept/${registration.shipId}`, 
      data, 
      {
      headers: {
        'Authorization': `${accessToken}`,
        'Content-Type': 'application/json'
      },
    }).pipe(catchError(this.handleError));
  }
}
