import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppResource } from 'src/app/app.resource';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { FormVM } from 'src/app/shared/models/pokemonVM';

@Component({
  selector: 'app-pokemon-evolution',
  templateUrl: './pokemon-evolution.component.html',
  styleUrls: ['./pokemon-evolution.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class PokemonEvolutionComponent extends BaseComponent implements OnInit {
  @Input() formVM!: FormVM;
  loc!: string;

  constructor(
    resources: AppResource,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super(resources);
    this.loc = this.route.snapshot.params['loc'];
  }

  ngOnInit() {}

  navigateTo(id: number) {
    this.router.navigate(['/' + this.loc, 'pokemon', id]);
  }

  getNbColumns(nb: number): string {
    return nb > 5 ? 'grid-cols-5' : 'grid-cols-' + nb;
  }
}
