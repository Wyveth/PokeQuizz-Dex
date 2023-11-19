import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParametersRequest } from '../models/shared/parametersRequest';
import { AbstractService } from './abstract/abstract.service';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { AppConfig } from 'src/app/app.config';
import { ApiRequest } from '../request';
import { Game } from '../models/concretes/game';

@Injectable({
  providedIn: 'root',
})
export class GameService extends AbstractService {
  parametersRequest!: ParametersRequest;
  api_game: string;

  constructor(config: AppConfig, httpClient: HttpClient) {
    super(config, httpClient);
    this.api_game = config.getConfig('games_api');
    console.log('API Game: ' + this.api_game);
  }

  public getGames(): Observable<any> {
    this.parametersRequest = {
      url: this.api_game,
      parameters: [],
    };

    const path = this.basePath + this.parametersRequest.url;
    return ApiRequest.get<Game[]>(
      this.httpClient,
      this.defaultHeaders,
      this.configuration,
      path,
      this.parametersRequest,
      undefined,
      'body',
      false
    );
  }
}
