import { Component, Input, OnInit } from '@angular/core';
import { Pokemon } from 'src/app/Shared/Models/Pokemon.model';

@Component({
  selector: 'app-Pokemon-Item',
  templateUrl: './Pokemon-Item.component.html',
  styleUrls: ['./Pokemon-Item.component.css']
})
export class PokemonItemComponent implements OnInit {
  @Input() pokemon!: Pokemon;
  
  constructor() { }

  ngOnInit() {
  }

}
