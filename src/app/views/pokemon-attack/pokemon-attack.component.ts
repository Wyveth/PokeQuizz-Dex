import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AppResource } from 'src/app/app.resource';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { TypeLearnAttackVM } from 'src/app/shared/models/pokemonVM';

@Component({
  selector: 'app-pokemon-attack',
  templateUrl: './pokemon-attack.component.html',
  styleUrls: ['./pokemon-attack.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class PokemonAttackComponent extends BaseComponent implements OnInit {
  @Input() typeLearnAttackVM!: TypeLearnAttackVM;

  constructor(resources: AppResource) {
    super(resources);
  }

  ngOnInit() {}
}
