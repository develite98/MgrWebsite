import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'task-content-expand',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-content-expand.component.html',
  styleUrl: './task-content-expand.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskContentExpandComponent {
  @Input() public title: string = '';
}
