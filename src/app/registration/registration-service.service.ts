import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Registration } from './registration';
import { environment } from '../../environments/environment';
import {
  GetSecretValueCommand,
  SecretsManagerClient
} from '@aws-sdk/client-secrets-manager';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  BACKEND_URL = environment.AUTHENTICATOR_URL;
  secret = undefined;
  constructor(private http: HttpClient) { }

  async getSecrets() {
    if (this.secret !== undefined) {
      return this.secret;
    } else {
      try {
        const client = new SecretsManagerClient({
          region: environment.REGION,
        });
        const response = await client.send(new GetSecretValueCommand({
            SecretId: environment.SECRET_ID
        }));
        // Depends on how the secret string was set. If set as a string use 'SecretString'
        // If set as a binary stream use 'SecretBinary'
        if ('SecretString' in response) {
          this.secret =  JSON.parse((response.SecretString as string));
          console.log(this.secret);
          return this.secret;
        }
      } catch (error) {
        throw error;
      }
    }
}

  async getRegistrations() : Promise<Observable<Registration[]>> {
    const secret = await this.getSecrets();
    return this.http.get<Registration[]>(`${this.BACKEND_URL}/v1/register/status`, {
      headers: {
        'Authorization': this.secret!['apiKey']
      }
    });
  }

  async denyRegistration(registration: Registration) {
    const secret = await this.getSecrets();
    return this.http.put<Registration>(`${this.BACKEND_URL}/v1/register/deny/${registration.shipId}`, {}, {
      headers: {
        'Authorization': this.secret!['apiKey']
      }
    })
  }

  async acceptRegistration(registration: Registration) {
    const secret = await this.getSecrets();
    return this.http.put<Registration>(`${this.BACKEND_URL}/v1/register/accept/${registration.shipId}`, {}, {
      headers: {
        'Authorization': this.secret!['apiKey']
      }
    })
  }
}
