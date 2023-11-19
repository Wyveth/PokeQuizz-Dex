import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { AppResource } from 'src/app/app.resource';
import { CommonModule } from '@angular/common';
import { LanguageComponent } from '../language/language.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, LanguageComponent],
})
export class HeaderComponent extends BaseComponent implements OnInit {
  constructor(resources: AppResource) {
    super(resources);
  }

  ngOnInit() {}
}
