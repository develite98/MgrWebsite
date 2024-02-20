import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BasePageComponent } from '@mixcore/share/base';
import { MixSubToolbarComponent } from '@mixcore/share/components';
import { MixBreadcrumbsModule } from '@mixcore/ui/breadcrumbs';
import { MixButtonComponent } from '@mixcore/ui/button';
import { BrandSelectComponent } from '../components/brand-select/brand-select.component';
import { MenuAddonsComponent } from '../components/menu-addons/menu-addons.component';
import { MenuCategoriesComponent } from '../components/menu-categories/menu-categories.component';
import { MenuItemsComponent } from '../components/menu-items/menu-items.component';
import { BrandUiStore } from '../state/brand-ui.store';

@Component({
  selector: 'mix-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MixBreadcrumbsModule,
    BrandSelectComponent,
    MixSubToolbarComponent,
    MixButtonComponent,
    MenuCategoriesComponent,
    MenuAddonsComponent,
    MenuItemsComponent,
  ],
})
export class MenusComponent extends BasePageComponent {
  public brandUi = inject(BrandUiStore);
}
