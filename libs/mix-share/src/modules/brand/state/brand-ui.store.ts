import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { filter } from 'rxjs';
import { Brand } from '../models/brand.model';

export interface BrandUiState {
  selectedBrandId: number | undefined;
}

@Injectable({ providedIn: 'root' })
export class BrandUiStore extends ComponentStore<BrandUiState> {
  public selectedBrandId$ = this.select((s) => s.selectedBrandId).pipe(
    filter(Boolean)
  );

  public changeSelected(brand: Brand) {
    this.patchState({ selectedBrandId: brand.id });
  }

  constructor() {
    super({
      selectedBrandId: undefined,
    });
  }
}
