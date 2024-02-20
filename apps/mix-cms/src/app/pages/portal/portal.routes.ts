import { Routes } from '@angular/router';
import { baseAppPath } from '@mixcore/share/app';
import { CMS_ROUTES } from '../../app.routes';

export const PortalRoutes: Routes = [
  {
    path: CMS_ROUTES.portal.dashboard.path,
    loadComponent: async () =>
      (await import('./dashboard/dashboard.component')).DashboardComponent,
    providers: [],
  },
  {
    path: CMS_ROUTES.portal.database.path,
    loadChildren: async () => (await import('@mixcore/module/database')).routes,
    providers: [baseAppPath(CMS_ROUTES.portal.database.path)],
  },
  {
    path: CMS_ROUTES.portal.cam.path,
    loadChildren: () =>
      import('@mixcore/module/account').then((m) => m.accountRoutes),
  },
  {
    path: CMS_ROUTES.portal.events.path,
    loadChildren: () =>
      import('@mixcore/module/scheduler').then((m) => m.schedulerRoutes),
  },
  {
    path: CMS_ROUTES.portal.work.path,
    loadChildren: () =>
      import('@mixcore/module/task').then((m) => m.taskManagementRoutes),
  },
  {
    path: CMS_ROUTES.portal.doc.path,
    loadChildren: () =>
      import('@mixcore/module/wiki').then((m) => m.wikiRoutes),
  },
  {
    path: CMS_ROUTES.portal.brandSupervision.path,
    loadChildren: () =>
      import('@mixcore/module/brand').then((m) => m.branchRoutes),
  },
  {
    path: '',
    redirectTo: CMS_ROUTES.portal.dashboard.path,
    pathMatch: 'full',
  },
];
