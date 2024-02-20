import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { BasePageComponent } from '@mixcore/share/base';
import { MixBreadcrumbsModule } from '@mixcore/ui/breadcrumbs';
import { ToolbarService } from '../../components/main-toolbar/toolbar.service';
import { ProjectSelectComponent } from './components/project-select/project-select.component';
import { TaskManageStore } from './store/task-ui.store';

@Component({
  selector: 'task-manage-layout',
  templateUrl: './task-manage.layout.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    CommonModule,
    ProjectSelectComponent,
    MixBreadcrumbsModule,
  ],
})
export class TaskManageLayoutComponent extends BasePageComponent {
  @ViewChild('projectTroller') public projectCtrl!: TemplateRef<unknown>;

  public toolbarSrv = inject(ToolbarService);
  public uiStore = inject(TaskManageStore);
}
