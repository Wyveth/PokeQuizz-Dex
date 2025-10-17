import { HttpClient, HttpHeaders, HttpParams, HttpUrlEncodingCodec } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Parameter, ParametersRequest } from './models/shared/parametersRequest';
import { ApiError } from './error';
import { catchError } from 'rxjs/operators';

export class ApiRequest {
  static get<T>(
    httpClient: HttpClient,
    headers: HttpHeaders,
    configuration: any,
    path: string,
    parametersRequest?: ParametersRequest,
    token?: string,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<T> {
    const consumes: string[] = ['application/json'];
    const httpContentTypeSelected: string | undefined =
      configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected !== undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
      headers = headers.set('Accept', '**');
      if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    }

    let queryParameters = new HttpParams({
      encoder: new HttpUrlEncodingCodec()
    });
    parametersRequest?.parameters?.forEach((parameter: Parameter) => {
      if (parameter.value == undefined && parameter.value == null) {
        throw new Error(
          'Parameter ' +
            parameter.name +
            ' is required but was null or undefined when calling ' +
            path +
            '.'
        );
      }

      if (parameter.value !== undefined && parameter.value !== null) {
        // S’il s’agit d’un path param (comme un ID), on le met dans l’URL
        if (
          path.includes(':' + parameter.name) ||
          parameter.name === 'id' ||
          parameter.name === 'number' ||
          parameter.name === 'family'
        ) {
          path = path + '/' + parameter.value;
        }
        // Sinon, on le met comme query param
        else {
          queryParameters = queryParameters.set(parameter.name, parameter.value.toString());
        }
      }
    });

    const requestOptions: any = {
      method: 'GET',
      headers: headers,
      params: queryParameters,
      observe: observe,
      reportProgress: reportProgress,
      responseType: 'json'
    };

    return httpClient
      .request<T>('GET', path, requestOptions)
      .pipe(catchError((error: any) => ApiError.handleApiError(path, error))) as Observable<T>;
  }

  static post<T>(
    httpClient: HttpClient,
    headers: HttpHeaders,
    configuration: any,
    path: string,
    body?: T,
    token?: string,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<T> {
    const consumes: string[] = ['application/json'];
    const httpContentTypeSelected: string | undefined =
      configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected !== undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
      headers = headers.set('Accept', '**');
      if (token) headers = headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const requestOptions: any = {
      method: 'POST',
      headers: headers,
      body: body,
      observe: observe,
      reportProgress: reportProgress,
      responseType: 'json'
    };

    return httpClient
      .request<T>('POST', path, requestOptions)
      .pipe(catchError((error: any) => ApiError.handleApiError(path, error))) as Observable<T>;
  }
}
