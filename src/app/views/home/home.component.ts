import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocService } from 'src/app/api/services/loc.service';
import { AppResource } from 'src/app/app.resource';
import { BaseComponent } from 'src/app/shared/components/base/base.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [CommonModule],
})
export class HomeComponent extends BaseComponent implements OnInit {
  loc!: string;

  constructor(
    resources: AppResource,
    private locService: LocService,
    private route: ActivatedRoute
  ) {
    super(resources);

    this.locService.loc$.subscribe((loc: string) => {
      this.loc = loc;
    });
  }
}
