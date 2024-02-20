import { Routes } from '@angular/router';
import { TaskManageLayoutComponent } from './task-manage.layout';
export const TASK_ROUTES = {
  timeline: 'timeline',
  board: 'board',
  project: 'project',
};

export const taskManagementRoutes: Routes = [
  {
    path: '',
    component: TaskManageLayoutComponent,
    children: [
      {
        path: TASK_ROUTES.board,
        loadComponent: () =>
          import('./board/board.component').then((c) => c.TaskBoardComponent),
      },
      {
        path: TASK_ROUTES.project,
        loadComponent: () =>
          import('./project/project.component').then((c) => c.ProjectComponent),
      },
      {
        path: TASK_ROUTES.timeline,
        loadComponent: () =>
          import('./timeline/timeline.component').then(
            (c) => c.TimelineComponent
          ),
      },
      {
        path: '',
        redirectTo: TASK_ROUTES.board,
        pathMatch: 'full',
      },
    ],
  },
];
