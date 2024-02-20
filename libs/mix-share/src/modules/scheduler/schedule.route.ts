import { Routes } from '@angular/router';

export const schedulerRoutes: Routes = [
  {
    path: 'schedulers',
    loadComponent: () =>
      import('./schedulers/schedulers.component').then(
        (c) => c.SchedulersComponent
      ),
  },
  {
    path: '',
    redirectTo: 'schedulers',
    pathMatch: 'full',
  },
];
