import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ControlValueAccessor, ReactiveFormsModule } from '@angular/forms';
import { TaskPriority, TaskPriorityIcon } from '@mixcore/lib/model';
import { BaseTextControl } from '@mixcore/ui/base-control';
import { MixSelectComponent } from '@mixcore/ui/select';
import { TaskPriorityComponent } from '../task-priority/task-priority.component';

@Component({
  selector: 'task-priority-select',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TaskPriorityComponent,
    MixSelectComponent,
  ],
  templateUrl: './task-priority-select.component.html',
  styleUrls: ['./task-priority-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskPrioritySelectComponent
  extends BaseTextControl
  implements ControlValueAccessor
{
  @Input() public size: 'm' | 's' | 'l' = 'm';
  public Icon = TaskPriorityIcon;
  public priorityItems = [
    TaskPriority.LOWEST,
    TaskPriority.LOW,
    TaskPriority.MEDIUM,
    TaskPriority.HIGH,
    TaskPriority.HIGHEST,
  ];
}
