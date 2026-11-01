import {
  APP_INITIALIZER,
  enableProdMode,
  ENVIRONMENT_INITIALIZER,
  inject,
  provideZoneChangeDetection
} from '@angular/core';
import { environment } from './environments/environment';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
  withXhr
} from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app/app.route';
import { AppComponent } from './app/app.component';
import { AppConfig } from './app/app.config';
import { AppResource } from './app/app.resource';
import { AuthInterceptor } from './app/shared/interceptor/AuthInterceptor';

if (environment.production) {
  enableProdMode();
}

export function loadResources(resourceService: AppResource) {
  return () => resourceService.load();
}

export function loadConfig(config: AppConfig) {
  return () => config.load();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
      })
    ),
    // Nécessaire pour que AuthInterceptor (HTTP_INTERCEPTORS) soit appliqué
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
    AppConfig,
    AppResource,
    {
      provide: APP_INITIALIZER,
      useFactory: loadResources,
      deps: [AppResource],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [AppConfig],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
});
