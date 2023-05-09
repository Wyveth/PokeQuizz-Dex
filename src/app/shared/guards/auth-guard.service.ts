import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router:Router) { }

  canActivate(): boolean|UrlTree {
    let location = "EN";
    switch (navigator.language.split('-')[0].toLocaleUpperCase())
    {
      case "FR" || "EN" || "ES" || "IT" || "DE" || "RU":
        location = navigator.language.split('-')[0].toLocaleUpperCase();
        break;
      case "ZH":
        location = "CN";
        break;
      case "KO":
        location = "CO";
        break;
      case "JA":
        location = "JP";
        break;
      default:
        location = "EN";
    }

    console.log("AuthGuardService", location);

    this.router.navigate([location, "pokedex"]);
    return false;
  }
}
