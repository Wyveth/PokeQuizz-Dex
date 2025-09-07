import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { AppResource } from 'src/app/app.resource';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.scss'],
    imports: [CommonModule]
})
export class BreadcrumbsComponent extends BaseComponent implements OnInit {
  constructor(resources: AppResource) {
    super(resources);
  }

  ngOnInit() {}
}
