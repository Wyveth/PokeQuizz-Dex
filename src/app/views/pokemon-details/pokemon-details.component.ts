import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { Attack } from 'src/app/api/models/concretes/attack';
import { Pokemon } from 'src/app/api/models/concretes/pokemon';
import { Router } from '@angular/router';
import { PokemonService } from 'src/app/api/services/pokemon.service';
import { AppConfig } from 'src/app/app.config';
import { AppResource } from 'src/app/app.resource';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { CommonModule } from '@angular/common';
import { PokemonEvolutionComponent } from '../pokemon-evolution/pokemon-evolution.component';
import { PokemonAttackComponent } from '../pokemon-attack/pokemon-attack.component';
import { LocService } from 'src/app/api/services/loc.service';
import { Family } from 'src/app/api/models/concretes/Family';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  imports: [CommonModule, PokemonEvolutionComponent, PokemonAttackComponent, Button]
})
export class PokemonDetailsComponent extends BaseComponent implements OnInit, OnDestroy {
  imgRoot: string = this.config.getConfig('img_root');

  pokemon!: Pokemon;

  stats: number[] = [];

  forms: { name: string; listForm: Family[] }[] = [];
  attacks: { name: string; listAttack: Attack[] }[] = [];

  key!: number;
  loc!: string;

  private destroy$ = new Subject<void>();

  constructor(
    resources: AppResource,
    private route: ActivatedRoute,
    private config: AppConfig,
    private locService: LocService,
    private pokemonService: PokemonService,
    private router: Router
  ) {
    super(resources);

    this.forms.push(
      { name: 'Evolutions', listForm: [] },
      { name: 'MegaForms', listForm: [] },
      { name: 'GigamaxForms', listForm: [] },
      { name: 'AlolaForms', listForm: [] },
      { name: 'GalarForms', listForm: [] },
      { name: 'HisuiForms', listForm: [] },
      { name: 'PaldeaForms', listForm: [] }
    );

    this.attacks.push(
      { name: 'Niveau', listAttack: [] },
      { name: 'Evolution', listAttack: [] },
      { name: 'CT/CS', listAttack: [] },
      { name: 'Reproduction', listAttack: [] },
      { name: 'Maître des Capacités', listAttack: [] }
    );
  }

  ngOnInit() {
    this.route.params
      .pipe(
        takeUntil(this.destroy$),
        map((params: Params) => ({
          loc: params['loc'] || 'FR',
          id: +params['id'] || null
        })),
        distinctUntilChanged((prev, curr) => prev.loc === curr.loc && prev.id === curr.id)
      )
      .subscribe(({ loc, id }) => {
        if (this.loc !== loc || this.key !== id) {
          this.loc = loc;
          if (id !== null) this.key = id;

          // 🔁 Relance la requête API avec la nouvelle localisation
          this.loadPokemon();
        }
      });
  }

  private loadPokemon() {
    this.pokemonService
      .getPokemon(this.key, this.loc)
      .pipe(takeUntil(this.destroy$))
      .subscribe(pokemon => {
        this.pokemon = pokemon;

        this.stats = this.getStats(this.pokemon);

        this.attacks = [];
        this.pokemon.attacks?.forEach(attack => {
          if (attack?.typeLearn) this.populateTypeLearnByName(attack?.typeLearn, attack);
        });

        this.pokemonService
          .getFamilyAndVariants(
            this.pokemon.evolutionChainId,
            this.pokemon.dataInfo.displayName ?? '',
            this.loc
          )
          .pipe(takeUntil(this.destroy$))
          .subscribe((families: Family[]) => {
            this.forms = []; // Clear Evolutions forms before populating
            families.forEach(family => {
              this.populateFormsByName(family.typeEvolution + ' Forms', family);
            });
          });
      });
  }

  goBack() {
    const previousId = this.key - 1;
    if (previousId !== null) {
      this.router.navigate(['/' + this.loc, 'pokemon', previousId]);
    }
  }

  goNext() {
    const nextId = this.key + 1;
    if (nextId !== null) {
      this.router.navigate(['/' + this.loc, 'pokemon', nextId]);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getStats(pokemon: Pokemon): number[] {
    return [
      pokemon.statPv,
      pokemon.statAttaque,
      pokemon.statDefense,
      pokemon.statAttaqueSpe,
      pokemon.statDefenseSpe,
      pokemon.statVitesse
    ];
  }

  //#region Private Methods
  private populateFormsByName(formName: string, pokemon: Family) {
    let form = this.forms.find(x => x.name == formName);
    if (!form) {
      form = { name: formName, listForm: [] };
      this.forms.push(form);
    }

    form.listForm.push(pokemon);
  }

  private populateTypeLearnByName(typeLearnName: string, attack: Attack) {
    let att = this.attacks.find(x => x.name == typeLearnName);
    if (!att) {
      att = { name: typeLearnName, listAttack: [] };
      this.attacks.push(att);
    }

    att.listAttack.push(attack);
  }
  //#endregion
}
