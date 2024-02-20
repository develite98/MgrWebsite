import { InjectionToken } from '@angular/core';

export const BASE_APP_PATH = new InjectionToken<string>('');
export const baseAppPath = (path: string) => {
  return {
    provide: BASE_APP_PATH,
    useValue: path,
  };
};
