import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { BaseComponent } from '@mixcore/share/base';
import { MixButtonComponent } from '@mixcore/ui/button';
import { DialogRef } from '@ngneat/dialog';
import { MixApiFacadeService } from '../../api-service/mix-api-facade.service';

@Component({
  selector: 'mix-restart-app',
  templateUrl: './restart-app.component.html',
  styleUrls: ['./restart-app.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [MixButtonComponent, CommonModule],
})
export class RestartAppComponent extends BaseComponent {
  public dialogRef = inject(DialogRef);
  public apiFacade = inject(MixApiFacadeService);

  public restart() {
    this.apiFacade.globalAppApi
      .restartApplication()
      .pipe(this.observerLoadingStateSignal())
      .subscribe(() => {
        this.dialogRef.close();
      });
  }
}
