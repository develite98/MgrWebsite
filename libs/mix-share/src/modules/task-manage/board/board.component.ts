import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  ViewChild,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MixTaskNew,
  TaskStatus,
  TaskStatusColors,
  TaskStatusDisplay,
} from '@mixcore/lib/model';
import { BaseComponent } from '@mixcore/share/base';
import { MixSubToolbarComponent } from '@mixcore/share/components';
import { TrackByProp } from '@mixcore/share/pipe';
import { MixButtonComponent } from '@mixcore/ui/button';
import { MixEditorComponent } from '@mixcore/ui/editor';
import { MixInputComponent } from '@mixcore/ui/input';
import { SkeletonLoadingComponent } from '@mixcore/ui/skeleton';
import { MixTextAreaComponent } from '@mixcore/ui/textarea';
import { DialogService } from '@ngneat/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslocoModule } from '@ngneat/transloco';
import { forkJoin } from 'rxjs';
import { ProjectSelectComponent } from '../components/project-select/project-select.component';
import { TaskCreateComponent } from '../components/task-create/task-create.component';
import { TaskDndListComponent } from '../components/task-dnd-list/task-dnd-list.component';
import { TaskFilterComponent } from '../components/task-filter/task-filter.component';
import { TaskGroupListComponent } from '../components/task-group-list/task-group-list.component';
import { TaskHeaderComponent } from '../components/task-header/task-header.component';
import { TaskManageStore } from '../store/task-ui.store';
import { TaskService } from '../store/task.service';
import { TaskStore } from '../store/task.store';

@Component({
  selector: 'mix-task-manage',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    SkeletonLoadingComponent,
    MixSubToolbarComponent,
    MixButtonComponent,
    MixInputComponent,
    MixTextAreaComponent,
    MixEditorComponent,
    TaskDndListComponent,
    TaskFilterComponent,
    TaskGroupListComponent,
    TaskHeaderComponent,
    ProjectSelectComponent,
    TrackByProp,
    DragDropModule,
  ],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskBoardComponent extends BaseComponent {
  @ViewChild('mainBoard') mainBoard!: ElementRef<HTMLElement>;

  public dialog = inject(DialogService);
  public store = inject(TaskStore);
  public taskManage = inject(TaskManageStore);
  public taskService = inject(TaskService);
  public toast = inject(HotToastService);
  public zone = inject(NgZone);
  public boardWidth = signal('1340px');

  public TaskStatusDisplay = TaskStatusDisplay;
  public TaskStatusColors = TaskStatusColors;
  public taskStatuses: TaskStatus[] = [
    TaskStatus.BACKLOG,
    TaskStatus.SELECTED,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];
  public tasks: MixTaskNew[] = [];

  constructor() {
    super();
    this.store
      .getParentTasks()
      .pipe(takeUntilDestroyed())
      .subscribe((x) => {
        this.tasks = x;
      });
  }

  ngAfterViewInit() {
    new ResizeObserver((e) => {
      this.zone.run(() => {
        this.boardWidth.set(e[0].contentRect.width - 28 + 'px');
      });
    }).observe(this.mainBoard.nativeElement);
  }

  public addTask() {
    this.dialog.open(TaskCreateComponent, {
      width: 800,
      windowClass: 'top-align-modal',
    });
  }

  public drop(event: CdkDragDrop<MixTaskNew[]>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
    this.updateListPosition(this.tasks);
  }

  private updateListPosition(newList: MixTaskNew[]) {
    const requests = newList.map((issue, idx) => {
      const newIssueWithNewPosition = {
        ...issue,
        priority: idx + 1,
      } as MixTaskNew;

      this.store.addTask(newIssueWithNewPosition, 'Update');
      return this.taskService.saveTask(newIssueWithNewPosition);
    });

    forkJoin(requests)
      .pipe(
        this.toast.observe({
          loading: 'Saving...',
          success: 'Successfully save your change',
          error: 'Something error, please try again',
        })
      )
      .subscribe();
  }
}
