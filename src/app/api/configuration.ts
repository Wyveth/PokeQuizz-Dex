export interface ConfigurationParameters {
  basePath?: string;
}

export class Configuration {
  basePath?: string;

  constructor(configurationParameters: ConfigurationParameters = {}) {
    this.basePath = configurationParameters.basePath;
  }

  public selectHeaderContentType(contentTypes: string[]): string | undefined {
    if (contentTypes.length == 0) {
      return undefined;
    }
    const type = contentTypes.find((x) => this.isJsonMime(x));
    if (type === undefined) {
      return contentTypes[0];
    }
    return type;
  }

  public selectHeaderAccept(accepts: string[]): string | undefined {
    if (accepts.length == 0) {
      return undefined;
    }
    const type = accepts.find((x) => this.isJsonMime(x));
    if (type === undefined) {
      return accepts[0];
    }
    return type;
  }

  public isJsonMime(mime: string): boolean {
    const jsonMime: RegExp = new RegExp(
      '^(application/json|[^;/ \t]+/[^;/ \t]+[+]json)[ \t]*(;.*)?$',
      'i'
    );
    return (
      mime != null &&
      (jsonMime.test(mime) ||
        mime.toLowerCase() === 'application/json-patch+json')
    );
  }
}
