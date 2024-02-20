import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MixDatabase, MixDynamicData } from '@mixcore/lib/model';
import { MixApiFacadeService } from '@mixcore/share/api';
import { BaseComponent, LoadingState } from '@mixcore/share/base';
import { Utils } from '@mixcore/share/utils';
import { MixBreadcrumbsModule } from '@mixcore/ui/breadcrumbs';
import { MixButtonComponent } from '@mixcore/ui/button';
import { MixCheckboxComponent } from '@mixcore/ui/checkbox';
import { MixDefaultSkeletonComponent } from '@mixcore/ui/skeleton';
import { DialogRef } from '@ngneat/dialog';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { TuiFileLike } from '@taiga-ui/kit';
import { BehaviorSubject, delay, filter } from 'rxjs';
import { DatabaseDataStore } from '../../modules/database/store/database-data.store';
import { DynamicDbListComponent } from '../dynamic-db-list/dynamic-db-list.component';

type RecordActive = { db: MixDatabase; data?: MixDynamicData };

@Component({
  selector: 'mix-record-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyModule,
    MixButtonComponent,
    MixDefaultSkeletonComponent,
    MixCheckboxComponent,
    DynamicDbListComponent,
    MixBreadcrumbsModule,
  ],
  templateUrl: './record-form.component.html',
  styleUrls: ['./record-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class RecordFormComponent extends BaseComponent implements OnInit {
  public static dialogOption = {
    windowClass: 'mix-record-form-dialog side-modal',
    minWidth: '50vw',
    maxWidth: '95vw',
    enableClose: {
      escape: true,
      backdrop: false,
    },
  };

  public mixApi = inject(MixApiFacadeService);
  public store = inject(DatabaseDataStore);
  public cdr = inject(ChangeDetectorRef);

  public ref: DialogRef<
    {
      mixDatabase: MixDatabase;
      data: MixDynamicData | undefined;
    },
    MixDynamicData
  > = inject(DialogRef);

  public uploadFileFn = (file: TuiFileLike) => {
    const formData = new FormData();
    formData.append('file', file as File);
    formData.append('folder', 'MixContent/StaticFiles');

    return this.mixApi.uploadApi.uploadFile(formData);
  };

  public deleteFileFn = (file: string) => {
    return this.mixApi.uploadApi.deleteFile(file);
  };

  public modelData: MixDynamicData = {};
  public fields: FormlyFieldConfig[] = [];
  public form = new FormGroup({});
  public mode: 'create' | 'update' = 'create';
  public continueCreate = new FormControl(false);

  public historyItems: RecordActive[] = [];
  public activeItem = new BehaviorSubject<RecordActive | undefined>(undefined);

  constructor() {
    super();
    this.activeItem
      .pipe(
        takeUntilDestroyed(),
        delay(300),
        filter(Boolean),
        this.observerLoadingStateSignal()
      )
      .subscribe((active) => {
        this.onInitData(active.db, active.data);
        this.cdr.detectChanges();
      });
  }

  ngOnInit() {
    const value = {
      data: this.ref.data.data,
      db: this.ref.data.mixDatabase,
    };

    this.historyItems.push(value);
    this.activeItem.next(value);
  }

  public onInitData(db: MixDatabase, data: MixDynamicData | undefined) {
    this.form = new FormGroup({});
    this.modelData = {};
    this.fields = [];

    this.mode = data ? 'update' : 'create';
    const { model, fields } = Utils.BuildDynamicFormField(
      db.columns,
      data || {},
      this.uploadFileFn,
      this.deleteFileFn
    );

    this.fields = fields;
    this.modelData = model;
  }

  public onSaveData() {
    const active = this.activeItem.getValue();
    const db = active?.db!;
    const value = {
      ...this.modelData,
      ...this.form.getRawValue(),
    };

    this.mixApi.databaseApi
      .saveData(
        db.systemName,
        this.modelData.id ?? -1,
        Utils.clean(value),
        db.displayName
      )
      .pipe(this.observerLoadingState())
      .subscribe((result) => {
        if (this.mode === 'create' && this.continueCreate.value) {
          this.store.addData(result);
          this.form.reset();
          return;
        }

        this.ref.close(result);
      });
  }

  public onEditChildData(event: RecordActive) {
    this.loadingState.set(LoadingState.Loading);
    this.historyItems.push(event);
    this.activeItem.next(event);
  }

  public onBreadcrumbClick(event: { index: number; last: boolean }) {
    if (event.last) return;

    this.loadingState.set(LoadingState.Loading);
    this.activeItem.next(this.historyItems[event.index]);
    this.historyItems = this.historyItems.splice(0, event.index + 1);
  }
}
