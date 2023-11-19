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
      'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjA4MTY4M2FlLTBlODgtNDQ3Ny1hY2VjLTZhMTBhMDY4Njc4ZSIsInN1YiI6IkNoZXdpZUBLYWFzaHl5ay5jb20iLCJlbWFpbCI6IkNoZXdpZUBLYWFzaHl5ay5jb20iLCJqdGkiOiI0MDU1MGU4MC0xMGQxLTQ2NDQtOTYxZC1jZGZiZGJjOGZmZTciLCJuYmYiOjE3MDA0MzEwNzEsImV4cCI6MTcwMDQ3NDI3MSwiaWF0IjoxNzAwNDMxMDcxfQ.lWiNSoDgZH9Ixz-uIO0xxokcU44fjbm2JbzGg5S_xYP1XqT-cwfdEUkjN45GfePS-o62YPCN98iXAzvntNRVww',
      'body',
      false
    );
  }
}
