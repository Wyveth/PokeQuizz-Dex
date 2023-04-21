import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AppResource {
  private resource: any = null;

  constructor(private http: HttpClient) {}

  public getResource(key: any) {
    return this.resource[key];
  }

  public load(): Promise<void> {
    console.log('Entree dans Resource.load');
    return new Promise((resolve, reject) => {
      const request = this.http.get(`./locale/configuration.json`);
      if (request) {
        request.subscribe((resource: any) => {
          this.resource = resource;
          resolve();
        });
      } else {
        console.error('Locale resource file "locale.json" is not valid');
        reject();
      }
    });
  }
}
