import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from '../../configuration';
import { AppConfig } from 'src/app/app.config';

@Injectable({
  providedIn: 'root'
})
export class AbstractService {
  protected basePath = 'apiUrl';

  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();
  
  constructor(private config: AppConfig, protected httpClient: HttpClient) {
    this.basePath = config.getConfig('apiUrl');
   }
}
