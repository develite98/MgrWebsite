import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewEncapsulation,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MixBreadcrumbItemDirective } from './breadcrumbs-item.directive';

@Component({
  selector: 'mix-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MixBreadcrumbsComponent {
  @Input() showHome = true;

  @ContentChildren(MixBreadcrumbItemDirective)
  public items!: QueryList<MixBreadcrumbItemDirective>;
  public displayItems = signal<MixBreadcrumbItemDirective[]>([]);

  @Output() public itemClick = new EventEmitter<{
    data: MixBreadcrumbItemDirective;
    index: number;
    last: boolean;
  }>();

  ngAfterViewInit() {
    this.displayItems.set(this.items.toArray());
  }
}
