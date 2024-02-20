import { Injectable, inject } from '@angular/core';
import { BASE_APP_PATH } from './app-token';

@Injectable()
export class AppNavigationService {
  public baseAppUrl = inject(BASE_APP_PATH);
}
