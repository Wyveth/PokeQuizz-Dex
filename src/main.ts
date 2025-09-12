import {
  APP_INITIALIZER,
  enableProdMode,
  ENVIRONMENT_INITIALIZER,
  importProvidersFrom,
  inject,
} from '@angular/core';
import { environment } from './environments/environment';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { routes } from './app/app.route';
import { AppComponent } from './app/app.component';
import { AppConfig } from './app/app.config';
import { AppResource } from './app/app.resource';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
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
    importProvidersFrom(ToastModule),
    MessageService,
    ConfirmationService,
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      })
    ),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
        },
      },
    }),
    provideAnimations(),
    provideHttpClient(),
    provideAnimationsAsync(),
    AppConfig,
    AppResource,
    {
      provide: APP_INITIALIZER,
      useFactory: loadResources,
      deps: [AppResource],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [AppConfig],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
});
