import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BasePageComponent } from '@mixcore/share/base';
import {
  MixStatusIndicatorComponent,
  MixSubToolbarComponent,
} from '@mixcore/share/components';
import { MixBreadcrumbsModule } from '@mixcore/ui/breadcrumbs';
import { MixButtonComponent } from '@mixcore/ui/button';
import { MixEmptyContentComponent } from '@mixcore/ui/empty-content';
import { SkeletonLoadingComponent } from '@mixcore/ui/skeleton';
import { BrandStore } from '../state/brand.store';

@Component({
  selector: 'brands',
  standalone: true,
  imports: [
    CommonModule,
    MixBreadcrumbsModule,
    MixSubToolbarComponent,
    MixButtonComponent,
    MixEmptyContentComponent,
    SkeletonLoadingComponent,
    MixStatusIndicatorComponent,
  ],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss',
})
export class BrandsComponent extends BasePageComponent {
  public store = inject(BrandStore);
}
