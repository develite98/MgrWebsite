import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MixTaskNew,
  TaskPriority,
  TaskStatus,
  TaskStatusColors,
  TaskStatusDisplay,
  TaskTypeIcons,
} from '@mixcore/lib/model';
import { BaseComponent } from '@mixcore/share/base';
import { UserSelectComponent } from '@mixcore/share/components';
import { FormHelper, ObjectUtil } from '@mixcore/share/form';
import { MixUtcDatePipe } from '@mixcore/share/pipe';
import { MixButtonComponent } from '@mixcore/ui/button';
import { MixDatePickerComponent } from '@mixcore/ui/date-picker';
import { MixEditorComponent } from '@mixcore/ui/editor';
import { MixInlineInputComponent } from '@mixcore/ui/inline-input';
import { ModalService } from '@mixcore/ui/modal';
import { MixSelectComponent } from '@mixcore/ui/select';
import { SkeletonLoadingComponent } from '@mixcore/ui/skeleton';
import { ContentLoaderModule } from '@ngneat/content-loader';
import { DialogRef } from '@ngneat/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { delay, filter, take, takeUntil } from 'rxjs';
import { TaskService } from '../../store/task.service';
import { TaskStore } from '../../store/task.store';
import { StartEndDateComponent } from '../start-end-date/start-end-date.component';
import { StoryPointSelectComponent } from '../story-point-select/story-point-select.component';
import { TaskChecklistsComponent } from '../task-checklists/task-checklists.component';
import { TaskContentExpandComponent } from '../task-content-expand/task-content-expand.component';
import { TaskPrioritySelectComponent } from '../task-priority-select/task-priority-select.component';

@Component({
  selector: 'mix-task-detail-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContentLoaderModule,
    MixInlineInputComponent,
    MixEditorComponent,
    MixButtonComponent,
    MixSelectComponent,
    MixDatePickerComponent,
    MixUtcDatePipe,
    StartEndDateComponent,
    UserSelectComponent,
    SkeletonLoadingComponent,
    TaskPrioritySelectComponent,
    StoryPointSelectComponent,
    TaskContentExpandComponent,
    TaskChecklistsComponent,
  ],
  templateUrl: './task-detail-modal.component.html',
  styleUrls: ['./task-detail-modal.component.scss'],
})
export class TaskDetailModalComponent extends BaseComponent implements OnInit {
  public static windowClass = 'side-modal';
  public static modalSetting = {
    windowClass: 'side-modal',
    width: '70vw',
    height: '100vh',
  };

  public taskService = inject(TaskService);
  public taskStore = inject(TaskStore);
  public toast = inject(HotToastService);
  public modal = inject(ModalService);
  public dialogRef = inject(DialogRef<{ task: MixTaskNew }>);

  public task!: MixTaskNew;
  public TaskTypeIconDisplay = TaskTypeIcons;
  public taskForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    taskStatus: new FormControl(TaskStatus.BACKLOG, Validators.required),
    taskPriority: new FormControl(TaskPriority.LOW, Validators.required),
    taskPoint: new FormControl(1),
    reporter: new FormControl(),
    startDate: new FormControl(),
    fromDate: new FormControl(),
    dueDate: new FormControl(),
    checkList: new FormControl(),
  });
  public originalValue: object = {};
  public disableSave = signal(true);

  public TaskStatusColors = TaskStatusColors;
  public statusLabel = (status: TaskStatus) => TaskStatusDisplay[status];
  public statusItems = [
    TaskStatus.BACKLOG,
    TaskStatus.SELECTED,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  ngOnInit() {
    this.taskStore
      .getTaskById(this.dialogRef.data.task.id)
      .pipe(
        filter(Boolean),
        take(1),
        delay(500),
        this.observerLoadingStateSignal()
      )
      .subscribe((task) => {
        this.task = task;
        this.taskForm.patchValue(this.task);
        this.originalValue = ObjectUtil.clone(this.taskForm.getRawValue());
        this.initValueChanged();
      });
  }

  public initValueChanged() {
    this.taskForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.disableSave.set(!ObjectUtil.diff(value, this.originalValue));
      });
  }

  public saveTask(close = true) {
    if (FormHelper.validateForm(this.taskForm)) {
      const value = {
        ...this.task,
        ...this.taskForm.value,
      };

      this.taskService
        .saveTask(ObjectUtil.clean(value as any))
        .pipe(this.observerLoadingState())
        .subscribe({
          next: (res) => {
            this.taskStore.addTask(
              new MixTaskNew(value as unknown as MixTaskNew),
              'Update'
            );
            if (close) this.dialogRef.close();
          },
          error: this.handleError,
        });
    }
  }

  public deleteTask() {
    this.modal.asKForAction(
      'Are you sure to remove this task forever ?',
      () => {
        this.taskService
          .deleteTask(this.task)
          .pipe(this.observerLoadingStateSignal())
          .subscribe({
            next: () => {
              this.taskStore.deleteTask(this.task);
              this.dialogRef.close();
            },
            error: this.handleError,
          });
      }
    );
  }

  public handleError = () => {
    this.toast.error('Something error, please try again');
  };

  public onDateChange(value: { fromDate: Date; dueDate: Date | undefined }) {
    this.task.fromDate = value.fromDate;
    this.task.dueDate = value.dueDate;

    this.taskForm.controls.fromDate.patchValue(value.fromDate, {
      emitEvent: false,
    });
    this.taskForm.controls.dueDate.patchValue(value.dueDate, {
      emitEvent: false,
    });
    this.taskForm.updateValueAndValidity();
  }

  public onCheckListChange(data: Record<string, boolean>) {
    this.task.checkList = data;
    this.taskForm.controls.checkList.patchValue(data);
  }
}
