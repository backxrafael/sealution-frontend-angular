import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { Amplify } from 'aws-amplify';
import * as awsconfig from '../amplify_outputs.json';

Amplify.configure(awsconfig);
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
