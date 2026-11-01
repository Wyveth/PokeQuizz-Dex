import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { EnvironmentProviders, Provider } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AppConfig } from 'src/app/app.config';
import { AppResource } from 'src/app/app.resource';

/** Configuration factice : en test, aucun fichier de configuration n'est chargé. */
export class TestAppConfig {
  getConfig(key: string): string {
    return key === 'api_root' ? 'http://localhost/api/v1.0' : 'http://localhost/';
  }
  getEnv(): string {
    return 'test';
  }
  load(): Promise<void> {
    return Promise.resolve();
  }
}

/** Providers communs aux tests : HTTP simulé, routeur vide, configuration factice. */
export function testProviders(): (Provider | EnvironmentProviders)[] {
  return [
    provideHttpClient(),
    provideHttpClientTesting(),
    provideRouter([]),
    { provide: AppConfig, useClass: TestAppConfig },
    AppResource
  ];
}
