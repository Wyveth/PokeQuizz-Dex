import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-Language',
  templateUrl: './Language.component.html',
  styleUrls: ['./Language.component.scss']
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
    // ['/' + language + '/' + this.router.url.split('/')[2]]
    this.router.navigate([this.url]);
  }
}
