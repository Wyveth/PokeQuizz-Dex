import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocService {
  private locSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    'FR'
  );
  loc$: Observable<string> = this.locSubject.asObservable();

  setLoc(loc: string) {
    this.locSubject.next(loc);
  }
}
