import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MixButtonComponent } from '@mixcore/ui/button';

@Component({
  selector: 'mix-menu-addons',
  standalone: true,
  imports: [CommonModule, MixButtonComponent],
  templateUrl: './menu-addons.component.html',
  styleUrls: ['./menu-addons.component.scss'],
})
export class MenuAddonsComponent {}
