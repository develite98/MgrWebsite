import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GroupMenuItem, MenuItem } from '@mixcore/lib/model';
import { fadeInExpandOnEnterAnimation } from '@mixcore/share/animation';
import { AuthService } from '@mixcore/share/auth';
import { MixIconButtonComponent } from '@mixcore/ui/icon-button';
import { ModalService } from '@mixcore/ui/modal';
import { DialogService } from '@ngneat/dialog';
import { TranslocoModule } from '@ngneat/transloco';
import { tuiPure } from '@taiga-ui/cdk';
import {
  TuiDataListModule,
  TuiDropdownModule,
  TuiHostedDropdownModule,
} from '@taiga-ui/core';

@Component({
  selector: 'mix-main-side-menu',
  standalone: true,
  imports: [
    CommonModule,
    MixIconButtonComponent,
    RouterModule,
    TranslocoModule,
    TuiDataListModule,
    TuiHostedDropdownModule,
    TuiDropdownModule,
  ],
  templateUrl: './main-side-menu.component.html',
  styleUrls: ['./main-side-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [fadeInExpandOnEnterAnimation({ duration: 350 })],
})
export class MainSideMenuComponent {
  public activeRoute = inject(ActivatedRoute);
  public authService = inject(AuthService);
  public dialogService = inject(DialogService);
  public modal = inject(ModalService);
  public router = inject(Router);

  @Input() public showDetail = true;
  @Input() public menu: MenuItem[] = this.authService.portalMenu;
  @Output() public expandChange = new EventEmitter();

  public selectedMenu: MenuItem | undefined = undefined;
  public selectedMenus: Record<string, MenuItem | undefined> = {};
  public groupMenu: GroupMenuItem[] = [];

  constructor(public route: Router) {}

  ngOnInit() {
    this.selectedMenu = this.menu.find((x) => x.default);
    this.groupMenu = this.menu.reduce((acc, menuItem) => {
      const group = menuItem.group || 'base';
      const existingGroup = acc.find((groupItem) => groupItem.group === group);

      if (existingGroup) {
        existingGroup.items.push(menuItem);
      } else {
        acc.push({
          group,
          items: [menuItem],
        });
      }

      return acc;
    }, [] as GroupMenuItem[]);
  }

  @tuiPure
  public isMenuSelected(item: MenuItem, selectedMenu: MenuItem | undefined) {
    return item.title === selectedMenu?.title;
  }

  public onMenuSelect(menu: MenuItem, isParent = true) {
    if (menu.isDevelopment) {
      this.showDevelopment();
      return;
    }

    if (!menu.children?.length) {
      this.route.navigateByUrl(menu.url);
      if (isParent) this.selectedMenu = menu;

      return;
    }

    if (this.selectedMenu?.title === menu.title) {
      this.selectedMenu = undefined;
      return;
    }

    this.selectedMenu = menu;
  }

  public showDevelopment() {
    this.modal
      .info(
        '😟 We are sorry for the inconvenience. This feature is still under development.',
        'Coming soon'
      )
      .subscribe();
  }

  public toggleMenu(): void {
    this.showDetail = !this.showDetail;
    if (!this.showDetail) this.selectedMenus = {};
  }

  public logout(): void {
    this.modal.confirm('Do you want to logout ?').subscribe((ok) => {
      if (!ok) return;

      this.authService.logout(() => {
        this.router.navigateByUrl('auth/login');
      });
    });
  }
}
