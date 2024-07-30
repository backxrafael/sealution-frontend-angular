import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegistrationsComponent } from './registrations/registrations.component';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { fetchAuthSession } from 'aws-amplify/auth';
import { CreateRegistrationComponent } from './create-registration/create-registration.component';
import { CommonModule } from '@angular/common';
import { AccessTokensComponent } from "./access-tokens/access-tokens.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RegistrationsComponent, AmplifyAuthenticatorModule, CreateRegistrationComponent, AccessTokensComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sealution-frontend-angular';
}
