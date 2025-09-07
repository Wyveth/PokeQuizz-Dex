import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import {} from '@angular/common/http';
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
  declarations: [],
  imports: [AngularModules, PrimeNGModules],
  exports: [AngularModules, PrimeNGModules],
  providers: [],
})
export class SharedModule {}
