import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { PokemonService } from './api/services/pokemon.service';
import { HomeComponent } from './views/home/home.component';
import { PokedexComponent } from './views/pokedex/pokedex.component';
import { PokemonDetailsComponent } from './views/pokemon-details/pokemon-details.component';
import { PokemonEvolutionComponent } from './views/pokemon-evolution/pokemon-evolution.component';
import { PokemonItemComponent } from './views/pokemon-item/pokemon-item.component';
import { AppResource } from './app.resource';
import { SharedModule } from './shared/modules/shared.module';

export function initConfig(config: AppConfig) {
  return () => config.load();
}

export function initResource(resource: AppResource) {
  return () => resource.load();
}

@NgModule({
  declarations: [
    AppComponent,
    PokedexComponent,
    PokemonItemComponent,
    PokemonDetailsComponent,
    PokemonEvolutionComponent,
    HomeComponent,
  ],
  imports: [SharedModule],
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
