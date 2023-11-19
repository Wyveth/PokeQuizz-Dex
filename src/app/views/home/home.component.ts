import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppResource } from 'src/app/app.resource';
import { BaseComponent } from 'src/app/shared/components/base/base.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends BaseComponent implements OnInit {
  loc!: string;

  constructor(resources: AppResource, private route: ActivatedRoute) {
    super(resources);
    console.log('Localisation', this.route.snapshot.params['loc']);
    this.loc = this.route.snapshot.params['loc'];
  }
}
