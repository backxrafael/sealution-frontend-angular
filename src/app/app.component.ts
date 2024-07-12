import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegistrationsComponent } from './registrations/registrations.component';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { fetchAuthSession } from 'aws-amplify/auth';
import { CreateRegistrationComponent } from './create-registration/create-registration.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RegistrationsComponent, AmplifyAuthenticatorModule, CreateRegistrationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sealution-frontend-angular';

  async fetchToken() {
    try {
      const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
      console.log(idToken?.toString())
      console.log(accessToken?.toString())
    } catch(err) {
      console.log(err)
    }
  }
}
