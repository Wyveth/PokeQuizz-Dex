import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { LocService } from 'src/app/api/services/loc.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(private locService: LocService) {}

  canActivate(): boolean | UrlTree {
    let location = 'EN';
    switch (navigator.language.split('-')[0].toLocaleUpperCase()) {
      case 'FR' || 'EN' || 'ES' || 'IT' || 'DE' || 'RU':
        location = navigator.language.split('-')[0].toLocaleUpperCase();
        break;
      case 'ZH':
        location = 'CN';
        break;
      case 'KO':
        location = 'CO';
        break;
      case 'JA':
        location = 'JP';
        break;
      default:
        location = 'EN';
    }
    this.locService.setLoc(location);
    return true;
  }
}
