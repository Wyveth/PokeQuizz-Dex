import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { PokemonService } from './api/services/pokemon.service';
import { AppResource } from './app.resource';
import { SharedModule } from './shared/modules/shared.module';
import { AppRoutingModule } from './shared/modules/app-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './shared/interceptor/AuthInterceptor';

export function initConfig(config: AppConfig) {
  return () => config.load();
}

export function initResource(resource: AppResource) {
  return () => resource.load();
}

@NgModule({
  declarations: [AppComponent],
  imports: [SharedModule, AppRoutingModule],
  providers: [
    AppConfig,
    AppResource,
    {
      provide: APP_INITIALIZER,
      useFactory: initResource,
      deps: [AppResource],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [AppConfig],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
