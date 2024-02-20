import { Route } from '@angular/router';

export const BRANCH_ROUTE = {
  brand: 'brand',
  branch: 'branch',
  menu: 'menu',
};

export const branchRoutes: Route[] = [
  {
    path: BRANCH_ROUTE.brand,
    loadComponent: () =>
      import('./brands/brands.component').then((c) => c.BrandsComponent),
  },
  {
    path: BRANCH_ROUTE.branch,
    loadComponent: () =>
      import('./stores/stores.component').then((c) => c.StoresComponent),
  },
  {
    path: BRANCH_ROUTE.menu,
    loadComponent: () =>
      import('./menus/menus.component').then((c) => c.MenusComponent),
  },
  {
    path: '',
    redirectTo: BRANCH_ROUTE.brand,
    pathMatch: 'full',
  },
];
