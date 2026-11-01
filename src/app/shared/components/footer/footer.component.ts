import { TranslatePipe } from 'src/app/i18n/translate.pipe';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { AppResource } from 'src/app/app.resource';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TranslatePipe]
})
export class FooterComponent extends BaseComponent implements OnInit {
  constructor(resources: AppResource) {
    super(resources);
  }

  ngOnInit() {}
}
