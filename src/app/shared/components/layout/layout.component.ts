import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    BreadcrumbsComponent,
    FooterComponent,
  ],
})
export class LayoutComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
