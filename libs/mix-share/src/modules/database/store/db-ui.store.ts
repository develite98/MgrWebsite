import { Injectable } from '@angular/core';
import { MixDbContext } from '@mixcore/lib/model';
import { ComponentStore } from '@ngrx/component-store';
import { filter } from 'rxjs';

export interface DbUiState {
  selectedContextId: number | null;
}

@Injectable({ providedIn: 'root' })
export class DbUiStore extends ComponentStore<DbUiState> {
  public selectedContextId$ = this.select((s) => s.selectedContextId).pipe(
    filter(Boolean)
  );

  public changeSelected(context: MixDbContext) {
    this.patchState({ selectedContextId: context.id });
    localStorage.setItem('db_context_id', context.id.toString());
  }

  public changeContextId(id: number) {
    if (id === this.get().selectedContextId) return;

    this.patchState({ selectedContextId: id });
    localStorage.setItem('db_context_id', id.toString());
  }

  constructor() {
    super({
      selectedContextId: parseInt(
        localStorage.getItem('db_context_id') || '-1'
      ),
    });
  }
}
