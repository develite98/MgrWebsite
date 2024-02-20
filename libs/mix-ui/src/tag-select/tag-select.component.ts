import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'mix-tag-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tag-select.component.html',
  styleUrl: './tag-select.component.scss',
})
export class TagSelectComponent {
  @Input() checked: boolean = false;
  @Output() checkedChange = new EventEmitter();
}
