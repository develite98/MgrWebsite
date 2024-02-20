import { Route } from '@angular/router';

export const WIKI_ROUTES = {
  wiki: 'wiki',
};

export const wikiRoutes: Route[] = [
  {
    path: WIKI_ROUTES.wiki,
    loadComponent: () =>
      import('./wikis/wikis.component').then((c) => c.WikisComponent),
  },
  {
    path: '',
    redirectTo: WIKI_ROUTES.wiki,
    pathMatch: 'full',
  },
];
