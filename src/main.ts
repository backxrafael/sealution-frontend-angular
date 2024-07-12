import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { Amplify } from 'aws-amplify';
import { environment } from './environments/environment';

const awsconfig = {
  "auth": {
    "user_pool_id": environment.USERPOOL_ID,
    "user_pool_client_id": environment.USERPOOL_CLIENT_ID,
    "aws_region": environment.REGION
  }
}

Amplify.configure(awsconfig);
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
