import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LocService } from 'src/app/api/services/loc.service';
import { AppResource } from 'src/app/app.resource';
import { BaseComponent } from 'src/app/shared/components/base/base.component';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    imports: [CommonModule]
})
export class RegisterComponent extends BaseComponent implements OnInit {
  loc!: string;

  constructor(resources: AppResource, private locService: LocService) {
    super(resources);

    this.locService.loc$.subscribe((loc: string) => {
      this.loc = loc;
    });
  }

  ngOnInit() {}
}
