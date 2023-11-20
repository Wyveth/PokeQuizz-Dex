import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { AppResource } from 'src/app/app.resource';
import { CommonModule } from '@angular/common';
import { LanguageComponent } from '../language/language.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowRightFromBracket,
  faArrowRightToBracket,
} from '@fortawesome/free-solid-svg-icons';
import { LocService } from 'src/app/api/services/loc.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, LanguageComponent, FontAwesomeModule],
})
export class HeaderComponent extends BaseComponent implements OnInit {
  faArrowRightToBracket = faArrowRightToBracket;
  faArrowRightFromBracket = faArrowRightFromBracket;

  loc!: string;

  constructor(resources: AppResource, private locService: LocService) {
    super(resources);

    this.locService.loc$.subscribe((loc: string) => {
      this.loc = loc;
    });
  }
}
