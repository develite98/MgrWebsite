import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MixFilter, PaginationRequestModel } from '@mixcore/lib/model';
import { BaseCRUDStore } from '@mixcore/share/base';
import { combineLatest, switchMap, tap } from 'rxjs';
import { Branch } from '../models/branch.model';
import { BrandUiStore } from './brand-ui.store';

@Injectable({ providedIn: 'root' })
export class BranchStore extends BaseCRUDStore<Branch> {
  public brandUiStore = inject(BrandUiStore);
  public status$$ = toSignal(this.select((s) => s.status));

  public state$$ = toSignal(
    combineLatest([this.request$$, this.brandUiStore.selectedBrandId$]).pipe(
      tap(([request, brandId]) => {
        request['compareType'] = 'or';
        request['filterType'] = 'contain';
        request.orderBy = 'CreatedDateTime';
        request.searchMethod = 'Like';
        request.status = 'Published';
        request.direction = 'Desc';
        request.queries = <MixFilter[]>[
          {
            value: brandId,
            fieldName: 'bms_brand_id',
            compareOperator: 'Equal',
          },
        ];

        this.loadData(request);
      }),
      switchMap(() => this.select((s) => s))
    )
  );

  public override requestFn = (request: PaginationRequestModel) =>
    this.mixApi.databaseApi.getDataByName<Branch>('bms_branch', request);

  public override requestName = 'bms_branch';
  public override searchColumns = ['Branch Name', 'Code'];
  public override searchColumnsDict: { [key: string]: string } = {
    'Branch Name': 'name',
    Code: 'Code',
  };
}
