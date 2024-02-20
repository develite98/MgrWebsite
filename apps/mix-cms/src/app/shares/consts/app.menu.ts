import { MenuItem } from '@mixcore/lib/model';
import { TASK_ROUTES } from '@mixcore/module/task';
import { CMS_ROUTES } from '../../app.routes';

export const APP_MENU: MenuItem[] = [
  {
    group: 'base',
    title: 'Dashboard',
    url: CMS_ROUTES.portal.dashboard.fullPath,
    icon: 'dashboard',
    children: [
      {
        icon: 'analytics',
        title: 'Statistic',
        url: CMS_ROUTES.portal.dashboard.fullPath,
      },
    ],
  },
  {
    group: 'base',
    title: 'Database',
    url: '',
    iconColor: '#EC652C',
    icon: 'database',
    children: [
      {
        icon: 'format_list_numbered',
        title: 'Context',
        url: CMS_ROUTES.portal.databaseContext.fullPath,
        iconColor: '#BB56CF',
      },
      {
        icon: 'settings',
        title: 'Database Config',
        iconColor: '#2190E4',
        url: CMS_ROUTES.portal.database.fullPath,
      },
      {
        icon: 'table_view',
        title: 'Query Data',
        iconColor: '#00ACC1',
        url: CMS_ROUTES.portal.databaseQuery.fullPath,
      },
      {
        icon: 'database',
        title: 'Visualize Diagram',
        iconColor: '#EC652C',
        url: CMS_ROUTES.portal.database.fullPath,
        isDevelopment: true,
      },
      {
        icon: 'description',
        title: 'API Document',
        url: CMS_ROUTES.portal.dashboard.fullPath,
        isDevelopment: true,
      },
    ],
  },
  {
    group: 'base',
    title: 'Users',
    url: '',
    iconColor: '#2563eb',
    icon: 'group',
    children: [
      {
        icon: 'sort',
        title: 'All Users',
        url: CMS_ROUTES.portal.users.fullPath,
      },
      {
        icon: 'verified_user',
        title: 'Roles',
        iconColor: '#2190E4',
        url: CMS_ROUTES.portal.roles.fullPath,
      },
    ],
  },
  {
    group: 'base',
    title: 'Events',
    url: CMS_ROUTES.portal.events.fullPath,
    iconColor: '#f59e0b',
    icon: 'schedule_send',
    children: [
      {
        icon: 'sort',
        title: 'Schedulers',
        url: CMS_ROUTES.portal.schedulers.fullPath,
      },
    ],
  },
  {
    group: 'workspace',
    title: 'Kanban Board',
    url: CMS_ROUTES.portal.work.fullPath,
    iconColor: '#8F49DE',
    icon: 'view_kanban',
  },
  {
    group: 'workspace',
    title: 'Timeline',
    iconColor: '#E86427',
    url: `${CMS_ROUTES.portal.work.fullPath}/${TASK_ROUTES.timeline}`,
    icon: 'schedule',
  },
];

export const APP_NOT_SUPPER_ADMIN_MENU = [
  {
    title: 'Dashboard',
    url: CMS_ROUTES.portal.dashboard.fullPath,
    icon: 'empty_dashboard',
    children: [
      {
        icon: 'analytics',
        title: 'Statistic',
        url: CMS_ROUTES.portal.dashboard.fullPath,
      },
      {
        icon: 'breaking_news_alt_1',
        title: 'News',
        url: CMS_ROUTES.portal.news.fullPath,
      },
    ],
  },
];
