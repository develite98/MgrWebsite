import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MixButtonComponent } from '@mixcore/ui/button';

@Component({
  selector: 'mix-menu-items',
  templateUrl: './menu-items.component.html',
  styleUrls: ['./menu-items.component.scss'],
  standalone: true,
  imports: [CommonModule, MixButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuItemsComponent {}
