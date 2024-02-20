import { Injectable } from '@angular/core';
import { MixDynamicData, PaginationRequestModel } from '@mixcore/lib/model';
import { BaseCRUDStore } from '@mixcore/share/base';
import * as R from 'remeda';
import { tap } from 'rxjs';
import { MenuCategory } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryStore extends BaseCRUDStore<MenuCategory> {
  public override requestFn = (request: PaginationRequestModel) =>
    this.mixApi.databaseApi.getDataByName<MenuCategory>(
      'mms_category',
      request
    );

  public override requestName = 'mms_category';
  public override searchColumns = ['Title', 'Slug'];
  public override searchColumnsDict: { [key: string]: string } = {
    Title: 'name',
    Slug: 'slug',
  };

  public addCategory(cat: Partial<MenuCategory>) {
    return this.mixApi.databaseApi.saveData('mms_category', -1, cat).pipe(
      tap((result) => {
        const currentData = this.get().data;
        currentData.unshift(result as unknown as MenuCategory);
        this.patchState({ data: R.clone(currentData) });
        this.reUpdateCache();
      })
    );
  }

  public saveCategory(cat: MenuCategory) {
    return this.mixApi.databaseApi
      .saveData('mms_category', cat.id, cat as unknown as MixDynamicData)
      .pipe(
        tap((task) => {
          const currentData = this.get().data;
          const taskIndex = currentData.findIndex((x) => x.id === task.id);
          if (taskIndex >= 0)
            currentData[taskIndex] = task as unknown as MenuCategory;

          this.patchState({ data: R.clone(currentData) });
          this.reUpdateCache();
        })
      );
  }
}
