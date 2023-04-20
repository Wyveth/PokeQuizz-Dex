import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit {
  location!: any;
  url: string = this.router.url;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { 
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
  }

  ngOnInit() {
  }

  public navigateTo(language: string): void{
    this.location = this.router.url.split('/')[1];
    this.url = this.router.url.replace(this.location, language);
    this.router.navigate([this.url]);
  }
}
