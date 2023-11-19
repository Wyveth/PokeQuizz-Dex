import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppResource } from 'src/app/app.resource';
import { BaseComponent } from 'src/app/shared/components/base/base.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class LoginComponent extends BaseComponent implements OnInit {
  constructor(resources: AppResource) {
    super(resources);
  }
  ngOnInit() {}
}
