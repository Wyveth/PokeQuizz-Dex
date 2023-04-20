import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DockModule } from 'primeng/dock';
import { SpeedDialModule } from 'primeng/speeddial';
import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { PokemonService } from './api/services/pokemon.service';
import { BreadcrumbsComponent } from './shared/components/breadcrumbs/breadcrumbs.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { LanguageComponent } from './shared/components/language/language.component';
import { HomeComponent } from './views/home/home.component';
import { PokedexComponent } from './views/pokedex/pokedex.component';
import { PokemonDetailsComponent } from './views/pokemon-details/pokemon-details.component';
import { PokemonEvolutionComponent } from './views/pokemon-evolution/pokemon-evolution.component';
import { PokemonItemComponent } from './views/pokemon-item/pokemon-item.component';

const appRoutes: Routes = [
  { path: ':loc/home', component: HomeComponent },
  { path: ':loc/pokedex', component: PokedexComponent },
  { path: ':loc/pokedex/pokemon/:id', component: PokemonDetailsComponent },
  { path: '', component: HomeComponent },
  { path: 'pokedex', redirectTo: 'EN/pokedex' },
  { path: 'pokedex/pokemon/:id', redirectTo: 'pokedex/pokemon/:id' },
  { path: 'home', redirectTo: 'EN/pokedex' },
  { path: '**', redirectTo: 'home' }
];

export function initConfig(config: AppConfig) {
  return () => config.load();
}
@NgModule({
  declarations: [
    AppComponent,
    BreadcrumbsComponent,
    HeaderComponent,
    FooterComponent,
    LanguageComponent,
    PokedexComponent,
    PokemonItemComponent,
    PokemonDetailsComponent,
    PokemonEvolutionComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    DockModule,
    SpeedDialModule
  ],
  providers: [
    AppConfig,
    { 
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [AppConfig],
      multi: true 
    }, PokemonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
