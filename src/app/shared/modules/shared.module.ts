import { NgModule } from '@angular/core';
import { BreadcrumbsComponent } from '../components/breadcrumbs/breadcrumbs.component';
import { FooterComponent } from '../components/footer/footer.component';
import { HeaderComponent } from '../components/header/header.component';
import { LanguageComponent } from '../components/language/language.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';

const AngularModules = [
  CommonModule,
  BrowserModule,
  BrowserAnimationsModule,
  HttpClientModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
];

const PrimeNGModules = [AutoCompleteModule];

@NgModule({
  declarations: [
    BreadcrumbsComponent,
    FooterComponent,
    HeaderComponent,
    LanguageComponent,
  ],
  imports: [AngularModules, PrimeNGModules],
  exports: [
    BreadcrumbsComponent,
    FooterComponent,
    HeaderComponent,
    LanguageComponent,
    AngularModules,
    PrimeNGModules,
  ],
  providers: [],
})
export class SharedModule {}
