import { TranslatePipe } from 'src/app/i18n/translate.pipe';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Attack } from 'src/app/api/models/concretes/attack';
import { AppConfig } from 'src/app/app.config';
import { AppResource } from 'src/app/app.resource';
import { BaseComponent } from 'src/app/shared/components/base/base.component';

@Component({
  selector: 'app-pokemon-attack',
  templateUrl: './pokemon-attack.component.html',
  imports: [TranslatePipe, CommonModule]
})
export class PokemonAttackComponent
  extends BaseComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  @Input() typeLearnAttack!: { name: string; listAttack: Attack[] };

  /** Descriptions affichées (carte mobile et ligne du tableau), repérées par data-index. */
  @ViewChildren('desc') descriptions!: QueryList<ElementRef<HTMLElement>>;

  imgRoot: string = this.config.getConfig('img_root');

  /** Descriptions dépliées (index dans la liste). */
  private expanded = new Set<number>();
  /** Descriptions réellement coupées par la limite de 2 lignes : seules celles-ci sont dépliables. */
  private overflowing = new Set<number>();

  private observer?: ResizeObserver;
  private changesSubscription?: Subscription;

  constructor(
    resources: AppResource,
    private config: AppConfig,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    super(resources);
  }

  ngOnInit() {}

  /** Nouvelle liste (autre Pokémon) : tout est replié. */
  ngOnChanges() {
    this.expanded.clear();
  }

  ngAfterViewInit() {
    // Mesure à l'affichage et à chaque changement de taille (rotation, changement d'onglet…)
    this.observer = new ResizeObserver(() => this.zone.run(() => this.measure()));
    this.observeAll();
    this.changesSubscription = this.descriptions.changes.subscribe(() => this.observeAll());
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    this.changesSubscription?.unsubscribe();
  }

  isLong(index: number): boolean {
    return this.overflowing.has(index);
  }

  isExpanded(index: number): boolean {
    return this.expanded.has(index);
  }

  toggle(index: number) {
    if (!this.isLong(index)) return;
    if (this.expanded.has(index)) this.expanded.delete(index);
    else this.expanded.add(index);
  }

  private observeAll() {
    if (!this.observer) return;
    this.observer.disconnect();
    this.descriptions.forEach(d => this.observer!.observe(d.nativeElement));
  }

  private measure() {
    const next = new Set<number>();
    this.descriptions.forEach(d => {
      const element = d.nativeElement;
      const index = Number(element.dataset['index']);
      // Une description dépliée n'est plus limitée : on garde le résultat de la mesure précédente
      if (this.expanded.has(index)) {
        if (this.overflowing.has(index)) next.add(index);
        return;
      }
      // Élément masqué (version mobile ou ordinateur non affichée) : hauteur nulle, rien à mesurer
      if (element.clientHeight > 0 && element.scrollHeight > element.clientHeight + 1) next.add(index);
    });

    const changed =
      next.size !== this.overflowing.size || [...next].some(i => !this.overflowing.has(i));
    if (changed) {
      this.overflowing = next;
      this.cdr.detectChanges();
    }
  }
}
