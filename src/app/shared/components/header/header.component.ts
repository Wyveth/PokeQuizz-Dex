import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { AppResource } from 'src/app/app.resource';
import { CommonModule } from '@angular/common';
import { LanguageComponent } from '../language/language.component';
import { LocService } from 'src/app/api/services/loc.service';
import { RouterModule } from '@angular/router';
import { ThemeSwitchComponent } from '../theme-switch/theme-switch.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, LanguageComponent, ThemeSwitchComponent]
})
export class HeaderComponent extends BaseComponent implements OnInit {
  loc!: string;

  constructor(
    resources: AppResource,
    private locService: LocService
  ) {
    super(resources);

    this.locService.loc$.subscribe((loc: string) => {
      this.loc = loc;
    });
  }
}
