import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TippyDirective } from '@ngneat/helipopper';
import { tuiPure } from '@taiga-ui/cdk';
import { Brand } from '../../models/brand.model';
import { BrandUiStore } from '../../state/brand-ui.store';
import { BrandStore } from '../../state/brand.store';
@Component({
  selector: 'mix-brand-select',
  standalone: true,
  imports: [CommonModule, TippyDirective],
  templateUrl: './brand-select.component.html',
  styleUrl: './brand-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandSelectComponent {
  public store = inject(BrandStore);
  public uiStore = inject(BrandUiStore);

  public contexts = signal<Brand[]>([]);
  public destroy$ = inject(DestroyRef);

  @tuiPure
  public getLabelSize(size: 's' | 'm') {
    return size === 's' ? 'text-lg' : 'text-xl';
  }

  @Input() public size: 's' | 'm' = 'm';
  @Input() public ignoreItemAll = false;
  @Input() public selectedItemId?: number;
  @Output() public selectedItemChange = new EventEmitter<Brand>();

  ngOnInit() {
    this.store.vm$.pipe(takeUntilDestroyed(this.destroy$)).subscribe((vm) => {
      this.contexts.set(vm.data);

      if (!this.uiStore.state().selectedBrandId) {
        this.selectItem(this.contexts()[0]);
      }
    });

    this.uiStore.selectedBrandId$
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe((id) => {
        this.selectedItemId = id;
      });
  }

  @tuiPure
  public getSelected(brand: Brand[], selectedItemId?: number) {
    return brand.find((x) => x.id === selectedItemId);
  }

  @tuiPure
  public getItemVm(item: Brand) {
    return {
      name: item.name,
    };
  }

  public selectItem(brand: Brand) {
    this.selectedItemId = brand.id;
    this.selectedItemChange.emit(brand);
  }
}
