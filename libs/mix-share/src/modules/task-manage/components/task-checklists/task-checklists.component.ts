import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TaskChecklist } from '@mixcore/lib/model';

@Component({
  selector: 'task-checklists',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-checklists.component.html',
  styleUrl: './task-checklists.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskChecklistsComponent {
  @Input() set data(v: Record<string, boolean>) {
    if (!v) {
      this.checkLists = [];
      return;
    }

    this.checkLists = Object.keys(v).map((key) => ({
      description: key,
      isClose: v[key],
    }));
  }

  @Output() checkListsChange = new EventEmitter<Record<string, boolean>>();

  public value = new FormControl('');
  public checkLists: TaskChecklist[] = [];

  public onEnter() {
    if (!this.value.value) return;

    this.checkLists.push({
      isClose: false,
      description: this.value.value,
    });

    this.value.patchValue('');
    this.emit();
  }

  public checkedChange(i: number) {
    this.checkLists[i].isClose = !this.checkLists[i].isClose;
    this.emit();
  }

  public emit() {
    const obj: Record<string, boolean> = {};
    this.checkLists.forEach((c) => (obj[c.description] = c.isClose));

    this.checkListsChange.emit(obj);
  }

  public onRemove(item: TaskChecklist) {
    this.checkLists = this.checkLists.filter(
      (x) => x.description !== item.description
    );
    this.emit();
  }
}
