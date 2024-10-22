import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { Amplify } from 'aws-amplify';
import { environment } from './environments/environment';
import * as Sentry from "@sentry/angular";

Sentry.init({
  dsn: environment.SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/,/^https:\/\/dev.sealution.eu-west-1.sentigrate\.com/],
  // Session Replay
  replaysSessionSampleRate: 1.0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: environment.USERPOOL_ID,
      userPoolClientId: environment.USERPOOL_CLIENT_ID,
    }
  }
})
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
