import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { PokemonService } from './api/services/pokemon.service';
import { HomeComponent } from './views/home/home.component';
import { AppResource } from './app.resource';
import { SharedModule } from './shared/modules/shared.module';
import { AppRoutingModule } from './shared/modules/app-routing.module';

export function initConfig(config: AppConfig) {
  return () => config.load();
}

export function initResource(resource: AppResource) {
  return () => resource.load();
}

@NgModule({
  declarations: [AppComponent, HomeComponent],
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
    PokemonService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
