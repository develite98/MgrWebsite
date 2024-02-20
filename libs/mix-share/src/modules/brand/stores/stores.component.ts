import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BasePageComponent } from '@mixcore/share/base';
import { MixSubToolbarComponent } from '@mixcore/share/components';
import { MixBreadcrumbsModule } from '@mixcore/ui/breadcrumbs';
import { MixButtonComponent } from '@mixcore/ui/button';
import { MixDataTableModule, TableContextMenu } from '@mixcore/ui/table';
import { BrandSelectComponent } from '../components/brand-select/brand-select.component';
import { Branch } from '../models/branch.model';
import { BranchStore } from '../state/branch.store';
import { BrandUiStore } from '../state/brand-ui.store';

@Component({
  selector: 'stores',
  standalone: true,
  imports: [
    CommonModule,
    MixBreadcrumbsModule,
    MixSubToolbarComponent,
    MixButtonComponent,
    BrandSelectComponent,
    MixDataTableModule,
  ],
  templateUrl: './stores.component.html',
  styleUrl: './stores.component.scss',
})
export class StoresComponent extends BasePageComponent {
  public store = inject(BranchStore);
  public brandUi = inject(BrandUiStore);
  public selectedItems: Branch[] = [];
  public contextMenus: TableContextMenu<Branch>[] = [
    {
      label: 'Edit',
      icon: 'edit',
      action: (item: Branch) => {},
    },
    {
      label: 'Delete',
      icon: 'delete',
      action: (item: Branch) => {},
    },
  ];
}
