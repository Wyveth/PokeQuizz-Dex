import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from 'src/app/app.config';
import { map } from 'rxjs/operators';

const CACHE_SIZE = 5;

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  api_root: string;
  api_pokemon!: string;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient, private config: AppConfig) {
    this.api_root = this.config.getConfig('api_root');
    this.api_pokemon = this.api_root + this.config.getConfig('pokemons_api');
    console.log("API Pokemon: " + this.api_pokemon);
  }
  
  getPokemons(limit: boolean, max: number): Observable<any> {
     return this.http.get<any>(this.api_pokemon + "/" + limit + "/" + max, this.httpOptions).pipe(
       map(this.extractData)
     );
  }

  getPokemon(id: number): Observable<any> {
    return this.http.get<any>(this.api_pokemon + '/' + id, this.httpOptions).pipe(
      map(this.extractData)
    );
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
