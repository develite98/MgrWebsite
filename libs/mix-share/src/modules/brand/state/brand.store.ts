import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PaginationRequestModel } from '@mixcore/lib/model';
import { BaseCRUDStore } from '@mixcore/share/base';
import { map, tap } from 'rxjs';
import { Brand } from '../models/brand.model';

@Injectable({ providedIn: 'root' })
export class BrandStore extends BaseCRUDStore<Brand> {
  public override requestFn = (request: PaginationRequestModel) =>
    this.mixApi.databaseApi.getDataByName<Brand>('bms_brand', {
      ...request,
      columns: '',
      pageSize: 50,
    });

  public override vm$ = this.select((s) => s).pipe(
    map((s) => {
      return s;
    })
  );

  public override requestName = 'brand';
  public override searchColumns = ['Name', 'Brand ID'];
  public override searchColumnsDict: { [key: string]: string } = {
    Name: 'name',
    'Brand ID': 'id',
  };

  constructor() {
    super();

    this.request$$
      .pipe(
        tap(() => this.patchState({ status: 'Loading' })),
        tap((request) => this.loadData(request)),
        takeUntilDestroyed()
      )
      .subscribe();
  }
}
