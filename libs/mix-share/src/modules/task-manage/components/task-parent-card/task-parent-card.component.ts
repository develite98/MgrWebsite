import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  signal,
} from '@angular/core';
import { MixTaskNew, TaskStatistic, UserListVm } from '@mixcore/lib/model';
import { UserAvatarComponent } from '@mixcore/share/components';
import { UserInfoStore } from '@mixcore/share/stores';
import { MixButtonComponent } from '@mixcore/ui/button';
import { DialogService } from '@ngneat/dialog';
import { take } from 'rxjs';
import { TaskCreateComponent } from '../task-create/task-create.component';
import { TaskDateDisplayComponent } from '../task-date-display/task-date-display.component';
import { TaskDetailModalComponent } from '../task-detail-modal/task-detail-modal.component';

@Component({
  selector: 'mix-task-parent-card',
  standalone: true,
  imports: [
    CommonModule,
    MixButtonComponent,
    UserAvatarComponent,
    TaskDateDisplayComponent,
    DragDropModule,
  ],
  templateUrl: './task-parent-card.component.html',
  styleUrls: ['./task-parent-card.component.scss'],
})
export class TaskParentCardComponent {
  @Input() public task!: MixTaskNew;
  @Input() public taskStatistic: TaskStatistic | null = null;
  @Input() public open = true;
  @Output() public expandClick = new EventEmitter();
  public dialog = inject(DialogService);
  public userInfoStore = inject(UserInfoStore);
  public userInfo = signal<UserListVm | undefined>(undefined);
  public percentage = signal(0);

  public addTask() {
    this.dialog.open(TaskCreateComponent, {
      width: 800,
      windowClass: 'top-align-modal',
      data: {
        parentTask: this.task,
      },
    });
  }

  public editTask() {
    this.dialog.open(TaskDetailModalComponent, {
      data: { task: this.task },
      ...TaskDetailModalComponent.modalSetting,
    });
  }

  public ngOnChanges() {
    if (this.taskStatistic) {
      this.percentage.set(
        (this.taskStatistic.done / this.taskStatistic.total) * 100
      );
    }

    if (!this.task.reporter || this.userInfo()) return;

    this.userInfoStore
      .getUserById(this.task.reporter)
      .pipe(take(1))
      .subscribe((info) => {
        this.userInfo.set(info);
      });
  }
}
