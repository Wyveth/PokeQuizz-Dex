import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-Header',
  templateUrl: './Header.component.html',
  styleUrls: ['./Header.component.scss']
})
export class HeaderComponent implements OnInit {
  dockItems!: MenuItem[];
  constructor() { }

  ngOnInit() {
      this.dockItems = [
        {
            label: 'Bulbizarre',
            icon: "../../../../assets/Images/001-bulbasaur.svg"
        },
        {
            label: 'Salamèche',
            icon: "../../../../assets/Images/004-charmander.svg"
        },
        {
            label: 'Carapuce',
            icon: "../../../../assets/Images/007-squirtle.svg"
        },
        {
            label: 'Pikachu',
            icon: "../../../../assets/Images/025-pikachu.svg"
        }
    ];
  }
}
