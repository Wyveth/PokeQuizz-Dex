import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { AbstractService } from './abstract/abstract.service';
import { ParametersRequest } from '../models/shared/parametersRequest';
import { ApiRequest } from '../request';

@Injectable({
  providedIn: 'root'
})
export class PokemonService extends AbstractService {
  parametersRequest!: ParametersRequest;
  api_pokemon: string;

  constructor(config: AppConfig, httpClient: HttpClient) {
    super(config, httpClient);
    this.api_pokemon = config.getConfig('pokemons_api');
    console.log('API Pokemon: ' + this.api_pokemon);
  }

  getPokemons(limit: boolean, max: number): Observable<any> {
    this.parametersRequest = {
      url: this.api_pokemon,
      parameters: [
        { name: 'limit', value: limit },
        { name: 'max', value: max }
      ]
    };

    const path = this.basePath + this.parametersRequest.url;
    return ApiRequest.get(
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

  getPokemonsLight(
    limit: boolean = false,
    max: number = 0,
    gen: number | null = null,
    desc: boolean = false
  ): Observable<any> {
    let params = new HttpParams().set('limit', limit).set('max', max).set('desc', desc);

    // On ajoute 'gen' seulement s'il a une valeur
    if (gen !== null) {
      params = params.set('gen', gen);
    }

    return this.httpClient.get(`${this.basePath + this.api_pokemon}/Light`, { params });
  }

  getPokemon(id: number): Observable<any> {
    this.parametersRequest = {
      url: this.api_pokemon,
      parameters: [{ name: 'id', value: id }]
    };

    const path = this.basePath + this.parametersRequest.url;
    return ApiRequest.get(
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

  getEvolChain(family: string): Observable<any> {
    this.parametersRequest = {
      url: this.api_pokemon + '/GetEvol',
      parameters: [{ name: 'family', value: family }]
    };

    const path = this.basePath + this.parametersRequest.url;
    return ApiRequest.get(
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

  getVariants(number: string): Observable<any> {
    this.parametersRequest = {
      url: this.api_pokemon + '/GetVariant',
      parameters: [{ name: 'number', value: number }]
    };

    const path = this.basePath + this.parametersRequest.url;
    return ApiRequest.get(
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
