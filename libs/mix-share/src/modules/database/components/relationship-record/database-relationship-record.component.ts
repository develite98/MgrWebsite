import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MixDatabase,
  MixRelationShip,
  RelationShipType,
} from '@mixcore/lib/model';
import { ArrayUtil } from '@mixcore/share/form';
import { MixButtonComponent } from '@mixcore/ui/button';
import { MixInputComponent } from '@mixcore/ui/input';
import { MixSelectComponent } from '@mixcore/ui/select';
import { debounceTime } from 'rxjs';
import { MasterDbStore } from '../../store/master-db.store';

@Component({
  selector: 'mix-database-relationship-record',
  standalone: true,
  imports: [
    CommonModule,
    MixButtonComponent,
    MixInputComponent,
    MixSelectComponent,
    DragDropModule,
    ReactiveFormsModule,
  ],
  templateUrl: './database-relationship-record.component.html',
  styleUrls: ['./database-relationship-record.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatabaseRelationshipRecordComponent {
  @Output() public delete = new EventEmitter();
  @Output() public valueChange = new EventEmitter();
  @Input() public value!: Partial<MixRelationShip>;
  @Input() end = false;
  public databaseStore = inject(MasterDbStore);
  public cdr = inject(ChangeDetectorRef);

  public show = false;
  public allType = [RelationShipType.ManyToMany, RelationShipType.OneToMany];

  public allDatabaseIds = signal<number[]>([]);
  public allDbDict: Record<number, MixDatabase> = {};
  public form = inject(FormBuilder).group({
    displayName: ['', Validators.required],
    childId: [<number | undefined>undefined, Validators.required],
    type: [''],
  });

  public labelProcess = (dbId: number) => {
    return this.allDbDict[dbId]?.displayName || '';
  };

  public labelRelationShipProcess = (type: RelationShipType) => {
    return type === RelationShipType.ManyToMany
      ? 'Many to Many'
      : 'One to Many';
  };

  constructor() {
    effect(
      () => {
        const state = this.databaseStore.stateSignal();
        if (state) {
          this.allDbDict = ArrayUtil.toRecord(state.data, 'id');
          this.allDatabaseIds.set(state.data.map((x) => x.id));
          this.show = true;
          this.cdr.detectChanges();
        }
      },
      { allowSignalWrites: true }
    );

    this.form.valueChanges
      .pipe(takeUntilDestroyed(), debounceTime(200))
      .subscribe((value) => {
        this.value.displayName = value.displayName ?? '';

        if (value.childId != undefined) {
          this.value.childId = value.childId as number | undefined;
          this.value.destinateDatabaseName =
            this.allDbDict[value.childId].systemName;
        }

        this.valueChange.emit(this.value);
      });
  }

  ngOnInit() {
    this.databaseStore.stateSignal();
    this.form.patchValue(this.value, { emitEvent: false });
  }
}
