import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  continueURL = '';

  constructor(private _router: Router) {}

  public navigateTo(url: string): void {
    this._router.navigateByUrl(url);
  }
}
