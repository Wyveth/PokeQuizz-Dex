import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime } from 'rxjs/operators';
import { PokemonLight } from 'src/app/api/models/concretes/pokemon';
import { LocService } from 'src/app/api/services/loc.service';
import { AppResource } from 'src/app/app.resource';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { GenericUtils } from 'src/app/shared/utils/genericUtils';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule]
})
export class SearchComponent extends BaseComponent implements OnInit {
  @Input() pokemons!: PokemonLight[];
  loc!: string;
  @Output() filteredPokemons = new EventEmitter<PokemonLight[]>();

  formSearch!: FormGroup;

  constructor(
    resources: AppResource,
    private locService: LocService
  ) {
    super(resources);

    this.locService.loc$.subscribe((loc: string) => {
      this.loc = loc;
    });

    this.initForm();
  }

  ngOnInit() {
    this.formSearch.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      const filtered: PokemonLight[] = [];
      const query = value.search;

      if (query != '') {
        for (let i = 0; i < this.pokemons.length; i++) {
          const pokemon = this.pokemons[i];
          if (
            GenericUtils.getObject(pokemon, this.loc)
              .Name.toLowerCase()
              .includes(query.toLowerCase())
          )
            filtered.push(pokemon);
        }

        this.filteredPokemons.emit(filtered);
      } else {
        this.filteredPokemons.emit(this.pokemons);
      }
    });
  }

  initForm() {
    this.formSearch = new FormGroup({
      search: new FormControl('')
    });
  }
}
