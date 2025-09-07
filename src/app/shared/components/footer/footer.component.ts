import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { AppResource } from 'src/app/app.resource';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    imports: [CommonModule]
})
export class FooterComponent extends BaseComponent implements OnInit {
  constructor(resources: AppResource) {
    super(resources);
  }

  ngOnInit() {}
}
