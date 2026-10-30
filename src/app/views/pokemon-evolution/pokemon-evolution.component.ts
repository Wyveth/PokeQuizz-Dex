import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Family } from 'src/app/api/models/concretes/Family';
import { LocService } from 'src/app/api/services/loc.service';
import { AppConfig } from 'src/app/app.config';
import { AppResource } from 'src/app/app.resource';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { I18nService } from 'src/app/i18n/i18n.service';
import { TranslationKey } from 'src/app/i18n/fr';

@Component({
  selector: 'app-pokemon-evolution',
  templateUrl: './pokemon-evolution.component.html',
  imports: [CommonModule]
})
export class PokemonEvolutionComponent extends BaseComponent implements OnInit {
  @Input() forms!: { name: string; listForm: Family[] };
  loc!: string;

  imgRoot: string = this.config.getConfig('img_root');

  constructor(
    resources: AppResource,
    private locService: LocService,
    private router: Router,
    private config: AppConfig,
    private i18n: I18nService
  ) {
    super(resources);

    this.locService.loc$.subscribe((loc: string) => {
      this.loc = loc;
    });
  }

  ngOnInit() {}

  /** Titre du groupe en français (les noms de groupe sont construits avec typeEvolution + ' Forms'). */
  get title(): string {
    const key = (this.forms?.name ?? '').replace(/ ?Forms$/, '').trim();
    const titles: Record<string, TranslationKey> = {
      Normal: 'forms.normal',
      Evolutions: 'forms.normal',
      Méga: 'forms.mega',
      Mega: 'forms.mega',
      Gigamax: 'forms.gigamax',
      Alola: 'forms.alola',
      Galar: 'forms.galar',
      Hisui: 'forms.hisui',
      Paldea: 'forms.paldea'
    };
    return titles[key] ? this.i18n.t(titles[key]) : key;
  }

  navigateTo(id: number) {
    this.router.navigate(['/' + this.loc, 'pokemon', id]);
  }

  getNbColumns(nb: number): string {
    return nb > 5 ? 'grid-cols-5' : 'grid-cols-' + nb;
  }
}
