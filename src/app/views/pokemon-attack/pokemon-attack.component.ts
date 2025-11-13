import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Attack } from 'src/app/api/models/concretes/attack';
import { AppConfig } from 'src/app/app.config';
import { AppResource } from 'src/app/app.resource';
import { BaseComponent } from 'src/app/shared/components/base/base.component';

@Component({
  selector: 'app-pokemon-attack',
  templateUrl: './pokemon-attack.component.html',
  imports: [CommonModule]
})
export class PokemonAttackComponent extends BaseComponent implements OnInit {
  @Input() typeLearnAttack!: { name: string; listAttack: Attack[] };

  imgRoot: string = this.config.getConfig('img_root');

  constructor(
    resources: AppResource,
    private config: AppConfig
  ) {
    super(resources);
  }

  ngOnInit() {}
}
