import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AppResource } from 'src/app/app.resource';
import { Resource } from 'src/app/resources/resource';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true
})
export class BaseComponent implements OnInit {
  public resource!: Resource;

  constructor(protected resources: AppResource) {
    this.resource = resources['resource'];
  }

  ngOnInit() {}
}
