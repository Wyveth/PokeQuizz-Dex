import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Family } from 'src/app/api/models/concretes/Family';
import { LocService } from 'src/app/api/services/loc.service';
import { AppConfig } from 'src/app/app.config';
import { AppResource } from 'src/app/app.resource';
import { BaseComponent } from 'src/app/shared/components/base/base.component';

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
    private config: AppConfig
  ) {
    super(resources);

    this.locService.loc$.subscribe((loc: string) => {
      this.loc = loc;
    });
  }

  ngOnInit() {}

  navigateTo(id: number) {
    this.router.navigate(['/' + this.loc, 'pokemon', id]);
  }

  getNbColumns(nb: number): string {
    return nb > 5 ? 'grid-cols-5' : 'grid-cols-' + nb;
  }
}
