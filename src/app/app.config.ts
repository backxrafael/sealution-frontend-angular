import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { RegistrationService } from './registration/registration-service.service';
import { provideHttpClient } from '@angular/common/http';
import { DatabaseService } from './database-service.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    DatabaseService,
    RegistrationService
  ]
};
