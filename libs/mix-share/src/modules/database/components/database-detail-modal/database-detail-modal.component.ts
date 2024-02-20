import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgZone,
  OnInit,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  DbContextFixId,
  MixColumn,
  MixDatabase,
  MixRelationShip,
} from '@mixcore/lib/model';
import { EntityFormComponent } from '@mixcore/share/components';
import { FormHelper, MixFormErrorComponent } from '@mixcore/share/form';
import { toastObserverProcessing } from '@mixcore/share/helper';
import { DatabaseStore } from '@mixcore/share/stores';
import { MixButtonComponent } from '@mixcore/ui/button';
import { MixInlineInputComponent } from '@mixcore/ui/inline-input';
import { MixInputComponent } from '@mixcore/ui/input';
import { ModalService } from '@mixcore/ui/modal';
import { MixSelectComponent } from '@mixcore/ui/select';
import { MixDefaultSkeletonComponent } from '@mixcore/ui/skeleton';
import { ContentLoaderModule } from '@ngneat/content-loader';
import { DialogRef, DialogService } from '@ngneat/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { TuiLoaderModule } from '@taiga-ui/core';
import { TuiTabsModule } from '@taiga-ui/kit';
import { DetailPageKit } from 'libs/mix-share/src/kit/page-detail-base-kit.component';
import { delay, takeUntil } from 'rxjs';
import { DbUiStore } from '../../store/db-ui.store';
import { DatabaseEntityComponent } from '../database-entity/database-entity.component';
import { DatabaseInfoComponent } from '../database-info/database-info.component';
import { DatabaseMigrationComponent } from '../database-migration/database-migration.component';
import { DatabasePermissionComponent } from '../database-permission/database-permission.component';
import { DatabaseRelationshipComponent } from '../database-relationship/database-relationship.component';
import { DatabaseSelectComponent } from '../database-select/database-select.component';
import { DbContextSelectComponent } from '../db-context-select/db-context-select.component';

@Component({
  selector: 'mix-database-detail-modal',
  templateUrl: './database-detail-modal.component.html',
  styleUrls: ['./database-detail-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiTabsModule,
    TuiLoaderModule,
    MixInputComponent,
    MixButtonComponent,
    MixSelectComponent,
    MixFormErrorComponent,
    MixInlineInputComponent,
    MixDefaultSkeletonComponent,
    DatabaseSelectComponent,
    EntityFormComponent,
    DatabaseRelationshipComponent,
    DatabaseEntityComponent,
    DatabaseInfoComponent,
    DatabasePermissionComponent,
    DatabaseMigrationComponent,
    DbContextSelectComponent,
    ContentLoaderModule,
  ],
})
export class DatabaseDetailModalComponent
  extends DetailPageKit
  implements OnInit
{
  public static dialogOption = {
    windowClass: 'mix-record-form-dialog side-modal',
    minWidth: '50vw',
    maxWidth: '95vw',
    enableClose: {
      escape: true,
      backdrop: false,
    },
  };

  @ViewChildren(EntityFormComponent)
  entityForms!: QueryList<EntityFormComponent>;

  public toast = inject(HotToastService);
  public router = inject(Router);
  public databaseStore = inject(DatabaseStore);
  public modal = inject(ModalService);
  public zone = inject(NgZone);
  public dialog = inject(DialogService);
  public uiStore = inject(DbUiStore);
  public dialogRef = inject(DialogRef);

  public data: MixDatabase | undefined = undefined;
  public form = new FormGroup({
    displayName: new FormControl('', Validators.required),
    systemName: new FormControl('', Validators.required),
    description: new FormControl(''),
    updatePermissions: new FormControl<string[]>([]),
    deletePermissions: new FormControl<string[]>([]),
    createPermissions: new FormControl<string[]>([]),
    readPermissions: new FormControl<string[]>([]),
    mixDatabaseContextId: new FormControl(),
  });

  public baseSegment = [];

  ngOnInit() {
    const params = this.dialogRef.data;
    this.id = params['id'];
    this.baseSegment = params['baseSegment'];
    this.data = undefined;
    this.form.reset();

    if (!this.id || this.id === 'create') {
      this.mode = 'create';
      this.data = {
        columns: [],
      } as any;

      const contextId =
        this.activeRoute.snapshot.queryParams['mixDatabaseContextId'];
      this.updateDbContext(contextId ? parseInt(contextId) : undefined);
      return;
    }

    this.mode = 'update';
    this.mixApi.databaseApi
      .getById(this.id)
      .pipe(
        delay(300),
        takeUntil(this.destroy$),
        this.observerLoadingStateSignal()
      )
      .subscribe((v) => {
        this.data = new MixDatabase(v);
        this.uiStore.changeContextId(
          v.mixDatabaseContextId ?? DbContextFixId.MasterDb
        );

        this.form.patchValue(this.data, { emitEvent: false });
        this.cdr.detectChanges();
      });
  }

  public updateDbContext(id: number | undefined) {
    this.form.controls.mixDatabaseContextId.patchValue(id);
  }

  public submit(): void {
    if (this.entityForms.some((v) => !v.validate())) {
      this.activeTabIndex = 1;
      return;
    }

    if (!FormHelper.validateForm(this.form)) {
      this.activeTabIndex = 0;
      return;
    }

    const formValue = this.form.value as MixDatabase;
    this.mixApi.databaseApi
      .save({
        ...this.data,
        ...formValue,
        mixDatabaseContextId:
          formValue.mixDatabaseContextId === DbContextFixId.MasterDb
            ? undefined
            : formValue.mixDatabaseContextId,
      })
      .pipe(
        this.toast.observe({
          loading: `${this.mode === 'create' ? 'Creating' : 'Saving'} table`,
          success: 'Successfully applied change',
          error: 'Something error, please try again later.',
        })
      )
      .subscribe({
        next: (value) => {
          if (this.mode === 'create') this.mode = 'update';

          this.databaseStore.reload();
          this.data = new MixDatabase(value);
          this.cdr.detectChanges();
        },
      });
  }

  public onColumnsChange(columns: MixColumn[]) {
    if (!this.data) return;

    this.data.columns = columns;
  }

  public onRelationshipChange(value: Partial<MixRelationShip>[]) {
    if (this.data) this.data.relationships = value as MixRelationShip[];
  }

  public onDeleteRelationship(value: Partial<MixRelationShip>) {
    this.modal.asKForAction('Are you sure to delete this referrence?', () => {
      this.mixApi.databaseRelation
        .deleteById(value.id as number)
        .pipe(toastObserverProcessing(this.toast))
        .subscribe({
          next: () => {
            this.data!.relationships = this.data!.relationships.filter(
              (x) => x.id !== value.id
            );
            this.cdr.detectChanges();
          },
        });
    });
  }

  public goDatabaseData(sysName: string) {
    this.router.navigate([...this.baseSegment, 'query', sysName]);
    this.dialogRef.close();
  }
}
