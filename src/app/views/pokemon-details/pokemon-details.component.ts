import { TranslatePipe } from 'src/app/i18n/translate.pipe';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
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
import { TranslationKey } from 'src/app/i18n/fr';

type DetailsTab = 'infos' | 'stats' | 'evolutions' | 'capacites';

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  imports: [TranslatePipe, CommonModule, RouterModule, PokemonEvolutionComponent, PokemonAttackComponent]
})
export class PokemonDetailsComponent extends BaseComponent implements OnInit, OnDestroy {
  imgRoot: string = this.config.getConfig('img_root');

  pokemon!: Pokemon;

  stats: number[] = [];
  statLabels: TranslationKey[] = [
    'details.stat.hp',
    'details.stat.attack',
    'details.stat.defense',
    'details.stat.spAttack',
    'details.stat.spDefense',
    'details.stat.speed'
  ];

  /** Onglet affiché sur mobile (sur ordinateur, toutes les sections sont visibles). */
  tab: DetailsTab = 'infos';

  /** Affiche l'illustration chromatique (shiny) au lieu de la normale */
  shiny = false;

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
        this.shiny = false;
        this.tab = 'infos';

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

  /** Onglets mobiles, sans ceux qui n'ont pas de contenu. */
  get tabs(): { id: DetailsTab; label: TranslationKey; icon: string }[] {
    const tabs: { id: DetailsTab; label: TranslationKey; icon: string }[] = [
      { id: 'infos', label: 'details.tab.infos', icon: 'pi-info-circle' },
      { id: 'stats', label: 'details.tab.stats', icon: 'pi-chart-bar' }
    ];
    if (this.hasForms || this.pokemon?.evolvesFrom?.length || this.pokemon?.evolvesTo?.length)
      tabs.push({ id: 'evolutions', label: 'details.tab.evolutions', icon: 'pi-sync' });
    if (this.hasAttacks) tabs.push({ id: 'capacites', label: 'details.tab.moves', icon: 'pi-bolt' });
    return tabs;
  }

  /** Classes écrites en entier pour que Tailwind les génère. */
  get tabsGridClass(): string {
    return ['grid-cols-2', 'grid-cols-3', 'grid-cols-4'][this.tabs.length - 2] ?? 'grid-cols-4';
  }

  selectTab(tab: DetailsTab) {
    this.tab = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /** Masque la section sur mobile quand son onglet n'est pas actif. */
  mobileTab(tab: DetailsTab): string {
    return this.tab === tab ? '' : 'max-sm:hidden';
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

  /** Couleur d'accent issue du premier type (si fournie par l'API) */
  get accent(): string | null {
    const color = this.pokemon?.typePoks?.[0]?.typeColor?.trim();
    if (!color) return null;
    return /^[0-9a-f]{3,8}$/i.test(color) ? '#' + color : color;
  }

  get statTotal(): number {
    return this.pokemon?.statTotal || this.stats.reduce((sum, v) => sum + (v || 0), 0);
  }

  /** Largeur de la barre (base 255, valeur max d'une statistique de base) */
  statWidth(value: number): number {
    return Math.min(100, Math.round(((value || 0) / 255) * 100));
  }

  statColor(value: number): string {
    if (value >= 120) return 'bg-emerald-500';
    if (value >= 90) return 'bg-lime-500';
    if (value >= 60) return 'bg-amber-400';
    return 'bg-rose-500';
  }

  get hasForms(): boolean {
    return this.forms.some(f => f.listForm.length > 0);
  }

  get hasAttacks(): boolean {
    return this.attacks.some(a => a.listAttack.length > 0);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getStats(pokemon: Pokemon): number[] {
    return [
      pokemon.statPv,
      pokemon.statAttack ?? pokemon['statAttaque'],
      pokemon.statDefense,
      pokemon.statAttackSpe ?? pokemon['statAttaqueSpe'],
      pokemon.statDefenseSpe,
      pokemon.statSpeed ?? pokemon['statVitesse']
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
