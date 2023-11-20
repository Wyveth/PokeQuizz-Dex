import { Injectable } from '@angular/core';
import { AbstractService } from './abstract/abstract.service';
import { ParametersRequest } from '../models/shared/parametersRequest';
import { AppConfig } from 'src/app/app.config';
import { HttpClient } from '@angular/common/http';
import { AuthenticateUser } from '../models/concretes/authenticate-user';
import { ApiRequest } from '../request';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService extends AbstractService {
  parametersRequest!: ParametersRequest;
  api_authenticate: string;

  constructor(config: AppConfig, httpClient: HttpClient) {
    super(config, httpClient);
    this.api_authenticate = config.getConfig('authenticate_api');
    console.log('API Authenticate: ' + this.api_authenticate);
  }

  login(authenticateUser: AuthenticateUser) {
    this.parametersRequest = {
      url: this.api_authenticate + '/login',
      parameters: [],
    };

    const path = this.basePath + this.parametersRequest.url;
    console.log(this.api_authenticate, authenticateUser);
    return ApiRequest.post<AuthenticateUser>(
      this.httpClient,
      this.defaultHeaders,
      this.configuration,
      path,
      authenticateUser,
      undefined,
      'body',
      false
    );
  }

  register(authenticateUser: AuthenticateUser) {
    this.parametersRequest = {
      url: this.api_authenticate + '/register',
      parameters: [],
    };

    const path = this.basePath + this.parametersRequest.url;
    return ApiRequest.post<AuthenticateUser>(
      this.httpClient,
      this.defaultHeaders,
      this.configuration,
      path,
      authenticateUser,
      undefined,
      'body',
      false
    );
  }
}
