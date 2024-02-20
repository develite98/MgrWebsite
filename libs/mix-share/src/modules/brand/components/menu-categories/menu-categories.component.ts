import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MixButtonComponent } from '@mixcore/ui/button';
import { TippyDirective } from '@ngneat/helipopper';
import { HotToastService } from '@ngneat/hot-toast';
import { forkJoin } from 'rxjs';
import { MenuCategory } from '../../models/category.model';
import { CategoryStore } from '../../state/category.store';

@Component({
  selector: 'mix-menu-categories',
  standalone: true,
  imports: [
    CommonModule,
    MixButtonComponent,
    DragDropModule,
    ReactiveFormsModule,
    TippyDirective,
  ],
  templateUrl: './menu-categories.component.html',
  styleUrls: ['./menu-categories.component.scss'],
})
export class MenuCategoriesComponent {
  public categoryStore = inject(CategoryStore);
  public toast = inject(HotToastService);
  public categories = signal<MenuCategory[]>([]);
  public activeTabIndex = signal(0);
  public adding = signal(false);
  public addForm = new FormControl();

  constructor() {
    this.categoryStore.vm$.pipe(takeUntilDestroyed()).subscribe((vm) => {
      if (!vm.data?.length) return;

      const categoryMap: { [id: string]: MenuCategory } = {};
      const rootCategories: MenuCategory[] = [];
      const data = vm.data.sort((a, b) => a.priority - b.priority);

      data.forEach((category) => {
        category.subCategories = [];
        categoryMap[category.id] = category;
        if (
          category.mms_category_id === null ||
          category.mms_category_id === undefined
        ) {
          rootCategories.push(category);
        }
      });

      data.forEach((category) => {
        const parentId = category.mms_category_id;
        if (parentId !== null && categoryMap[parentId]) {
          categoryMap[parentId].subCategories.push(category);
        }
      });

      this.categories.set(rootCategories);
    });
  }

  public toggle(rootIndex: number) {
    this.activeTabIndex.set(
      this.activeTabIndex() === rootIndex ? -1 : rootIndex
    );
  }

  public addNewCat() {
    if (!this.addForm.value) return;

    this.categoryStore
      .addCategory({ title: this.addForm.value })
      .subscribe(() => {
        this.addForm.reset();
      });
  }

  public drop(event: CdkDragDrop<MenuCategory[]>) {
    const newCats = event.container.data;
    if (event.previousIndex === event.currentIndex) return;
    moveItemInArray(newCats, event.previousIndex, event.currentIndex);
    this.updateListPosition(newCats);
  }

  private updateListPosition(newList: MenuCategory[]) {
    const requests = newList.map((cat, idx) => {
      const newCatWithNewPosition = {
        ...cat,
        priority: idx + 1,
      } as MenuCategory;

      return this.categoryStore.saveCategory(newCatWithNewPosition);
    });

    forkJoin(requests)
      .pipe(
        this.toast.observe({
          loading: 'Saving...',
          success: 'Succesfully update your category',
          error: 'Something error, please try again',
        })
      )
      .subscribe();
  }
}
