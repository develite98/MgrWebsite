import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MixTaskNew,
  TaskPriority,
  TaskStatus,
  TaskType,
} from '@mixcore/lib/model';
import { BaseComponent } from '@mixcore/share/base';
import { HotToastService } from '@ngneat/hot-toast';
import { TuiAutoFocusModule } from '@taiga-ui/cdk';
import { Observable, combineLatest, forkJoin } from 'rxjs';
import { TaskFilterStore } from '../../store/filter.store';
import { TaskManageStore } from '../../store/task-ui.store';
import { TaskService } from '../../store/task.service';
import { TaskStore } from '../../store/task.store';
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'mix-task-dnd-list',
  standalone: true,
  imports: [
    CommonModule,
    TaskCardComponent,
    DragDropModule,
    ReactiveFormsModule,
    TuiAutoFocusModule,
  ],
  templateUrl: './task-dnd-list.component.html',
  styleUrls: ['./task-dnd-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TaskDndListComponent extends BaseComponent implements OnInit {
  @ViewChild('addTaskInput', { static: false })
  public input!: ElementRef<HTMLElement>;

  public destroyRef = inject(DestroyRef);
  public cdr = inject(ChangeDetectorRef);
  public taskStore = inject(TaskStore);
  public taskService = inject(TaskService);
  public taskUiStore = inject(TaskManageStore);
  public toast = inject(HotToastService);

  @Input() public parentTaskId?: number;
  @Input() public status!: TaskStatus;
  @Input() public index: number = 0;
  @Input() public listTasks!: Observable<MixTaskNew[]>;
  public tasks: MixTaskNew[] = [];
  public taskForm = new FormControl('');
  public showInput = signal(false);

  constructor(public filterStore: TaskFilterStore) {
    super();
  }

  ngOnInit() {
    combineLatest([this.listTasks, this.filterStore.userIds$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([tasks, filter]) => {
        this.combineFilter(tasks, filter.userIds);
      });
  }

  public combineFilter(tasks: MixTaskNew[], userIds: string[]) {
    if (!userIds?.length) {
      this.tasks = tasks;
    } else {
      this.tasks = tasks.filter(
        (task) => task.reporter && userIds.includes(task.reporter)
      );
    }

    this.cdr.detectChanges();
  }

  public addNewTask() {
    const value = this.taskForm.value;
    if (!value) return;

    this.taskService
      .saveTask({
        title: value,
        taskStatus: this.status,
        parentTaskId: this.parentTaskId,
        taskPriority: TaskPriority.MEDIUM,
        taskPoint: 1,
        mixProjectId: this.taskUiStore.state().selectedProjectId,
        type: TaskType.TASK,
      } as MixTaskNew)
      .pipe(this.observerLoadingStateSignal())
      .subscribe({
        next: (result) => {
          this.taskForm.reset();
          this.toast.success('Success add your new item');
          this.taskStore.addTask(result as unknown as MixTaskNew);
        },
        error: () => {
          this.toast.error('Something error, please try again');
        },
        complete: () => {},
      });
  }

  public drop(event: CdkDragDrop<MixTaskNew[]>) {
    const newIssue: MixTaskNew = { ...event.item.data };
    const newIssues = [...event.container.data];

    if (event.previousContainer === event.container) {
      if (event.previousIndex === event.currentIndex) return;

      moveItemInArray(newIssues, event.previousIndex, event.currentIndex);
      this.updateListPosition(newIssues);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        newIssues,
        event.previousIndex,
        event.currentIndex
      );

      const newIssueIndex = newIssues.findIndex((x) => x.id === newIssue.id);
      newIssues[newIssueIndex].taskStatus = event.container.id as TaskStatus;
      this.updateListPosition(newIssues);
    }
  }

  public onClickAdd() {
    this.showInput.set(true);
  }

  private updateListPosition(newList: MixTaskNew[]) {
    const requests = newList.map((issue, idx) => {
      const newIssueWithNewPosition = {
        ...issue,
        priority: idx + 1,
        parentTaskId: this.parentTaskId,
      } as MixTaskNew;

      this.taskStore.addTask(newIssueWithNewPosition, 'Update');
      return this.taskService.saveTask(newIssueWithNewPosition);
    });

    forkJoin(requests)
      .pipe(
        this.toast.observe({
          loading: 'Saving...',
          success: 'Succesfully update your task',
          error: 'Something error, please try again',
        })
      )
      .subscribe();
  }
}
