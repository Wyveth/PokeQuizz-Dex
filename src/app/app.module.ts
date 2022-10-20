import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DockModule } from 'primeng/dock';
import { SpeedDialModule } from 'primeng/speeddial';

import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { PokedexComponent } from './Views/Pokedex/Pokedex.component';
import { HomeComponent } from './Views/Home/Home.component';
import { BreadcrumbsComponent } from './Shared/Components/Breadcrumbs/Breadcrumbs.component';
import { HeaderComponent } from './Shared/Components/Header/Header.component';
import { FooterComponent } from './Shared/Components/Footer/Footer.component';
import { PokemonService } from './Shared/Services/Pokemon.service';
import { PokemonItemComponent } from './Views/Pokemon-Item/Pokemon-Item.component';
import { PokemonDetailsComponent } from './Views/Pokemon-Details/Pokemon-Details.component';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'pokedex', component: PokedexComponent },
  { path: 'pokedex/pokemon/:id', component: PokemonDetailsComponent },
  { path: '', component: HomeComponent },
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
    PokedexComponent,
    PokemonItemComponent,
    PokemonDetailsComponent,
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
