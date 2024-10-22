import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegistrationsComponent } from './registrations/registrations.component';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { BackendService } from "./services/backend-service.service";
import { CreateRegistrationComponent } from './create-registration/create-registration.component';
import { CommonModule, NgIf } from '@angular/common';
import { Hub } from 'aws-amplify/utils';
import { AccessTokensComponent } from "./access-tokens/access-tokens.component";
import * as sentry from '@sentry/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NgIf, RouterOutlet, RegistrationsComponent, AmplifyAuthenticatorModule, CreateRegistrationComponent, AccessTokensComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private backendService: BackendService) {
    Hub.listen('auth', (data) => {
      console.log(data);
      const {payload} = data;
      if (payload.event === 'signedIn') {
        this.fetchUserGroups();
      } else if (payload.event === 'signedOut') {
        this.userGroups = []
      }
    })
  }
  title = 'sealution-frontend-angular';
  userGroups: string[] = [];

  // Use OnInit lifecycle hook to handle the async call
  async ngOnInit(): Promise<void> {
    console.log('calling onInit')
    await this.fetchUserGroups();
  }

  async fetchUserGroups() {
    try {
      this.userGroups = (await this.backendService.getUserGroup()) as string[];
      console.log(this.userGroups);
    } catch (error) {
      console.error('Error fetching user groups', error);
      sentry.captureException(error);
    }
  }
}
