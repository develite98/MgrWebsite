import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ControlValueAccessor, ReactiveFormsModule } from '@angular/forms';
import { BaseTextControl } from '@mixcore/ui/base-control';
import { MixSelectComponent } from '@mixcore/ui/select';

@Component({
  selector: 'story-point-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MixSelectComponent],
  templateUrl: './story-point-select.component.html',
  styleUrl: './story-point-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoryPointSelectComponent
  extends BaseTextControl
  implements ControlValueAccessor
{
  @Input() public size: 'm' | 's' | 'l' = 's';
  public storyPointItems = [1, 2, 3, 5, 8, 13];
  public infoDict: { [key: string | number]: any } = {
    8: {
      text: 'Should split',
      class: 'text-warning',
    },
    13: {
      text: 'Must split',
      class: 'text-danger',
    },
  };
}
