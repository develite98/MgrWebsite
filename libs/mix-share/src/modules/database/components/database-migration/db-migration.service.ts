import { Injectable, inject } from '@angular/core';
import { RestartAppComponent } from '@mixcore/share/components';
import { DialogService } from '@ngneat/dialog';

@Injectable({ providedIn: 'root' })
export class DbMigrationService {
  dialog = inject(DialogService);

  public restartApp(title?: string) {
    this.dialog.open(RestartAppComponent, {
      data: { title },
      enableClose: { escape: false, backdrop: false },
    });
  }
}
