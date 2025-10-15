import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PokemonLight } from 'src/app/api/models/concretes/pokemon';
import { PokemonService } from 'src/app/api/services/pokemon.service';
import { AppConfig } from 'src/app/app.config';
import { AppResource } from 'src/app/app.resource';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { PokemonItemComponent } from '../pokemon-item/pokemon-item.component';
import { SearchComponent } from '../search/search.component';
import { LocService } from 'src/app/api/services/loc.service';

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  imports: [CommonModule, PokemonItemComponent, SearchComponent]
})
export class PokedexComponent extends BaseComponent implements OnInit, OnDestroy {
  pokemons: PokemonLight[] = [];
  displayedPokemons: PokemonLight[] = [];
  filteredPokemons: PokemonLight[] = [];

  waiting = false;
  loadingMore = false;

  batchSize = 100;
  batchIndex = 0;

  imgRoot: string = this.config.getConfig('img_root');
  formSearch!: FormGroup;

  loc!: string;

  private destroy$ = new Subject<void>();

  constructor(
    resources: AppResource,
    private pokemonService: PokemonService,
    private locService: LocService,
    private config: AppConfig,
    private route: ActivatedRoute
  ) {
    super(resources);
  }

  ngOnInit() {
    this.waiting = true;

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params: Params) => {
      const newLoc = params['loc'] || 'FR';
      if (this.loc !== newLoc) {
        this.loc = newLoc;
        this.locService.setLoc(this.loc);
        this.loadPokemons();
      }
    });
  }

  private loadPokemons() {
    this.waiting = true;
    this.pokemonService
      .getPokemonsLight(false, 0, null, false)
      .pipe(takeUntil(this.destroy$))
      .subscribe(pokemons => {
        this.pokemons = pokemons;
        this.filteredPokemons = pokemons;

        this.displayedPokemons = [];
        this.batchIndex = 0;
        this.addNextBatch();

        this.waiting = false;
      });
  }

  filterPokemons(event: PokemonLight[]) {
    this.filteredPokemons = event;
    this.displayedPokemons = [];
    this.batchIndex = 0;
    this.addNextBatch();
  }

  addNextBatch() {
    if (this.batchIndex >= this.filteredPokemons.length) return;

    const nextBatch = this.filteredPokemons.slice(
      this.batchIndex,
      this.batchIndex + this.batchSize
    );
    this.displayedPokemons = [...this.displayedPokemons, ...nextBatch];
    this.batchIndex += this.batchSize;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
      !this.loadingMore &&
      this.batchIndex < this.filteredPokemons.length
    ) {
      this.loadingMore = true;
      setTimeout(() => {
        this.addNextBatch();
        this.loadingMore = false;
      }, 100);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
