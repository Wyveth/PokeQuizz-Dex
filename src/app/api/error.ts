import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export class ApiError extends Error {
  httpError: HttpErrorResponse;
  requestPath: string;

  constructor(
    message: string,
    httpError: HttpErrorResponse,
    requestPath: string
  ) {
    super(message);
    this.httpError = httpError;
    this.requestPath = requestPath;
  }

  public static handleApiError(path: string, error: HttpErrorResponse) {
    let message: string;
    if (error.status === 0)
      message = 'A client side error occured: ' + error.error;
    else message = 'A server side error occured: ' + error.status;
    return throwError(() => new ApiError(message, error, path));
  }
}
