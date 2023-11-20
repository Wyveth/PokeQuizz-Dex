import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocService {
  private locSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public loc$: Observable<any> = this.locSubject.asObservable();

  setLoc(loc: string) {
    this.locSubject.next(loc);
  }

  getLoc() {
    return this.loc$;
  }
}
