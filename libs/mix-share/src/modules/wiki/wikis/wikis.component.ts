import { ArrayDataSource } from '@angular/cdk/collections';
import {
  CdkNestedTreeNode,
  CdkTreeModule,
  NestedTreeControl,
} from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { BasePageComponent } from '@mixcore/share/base';
import { MixBreadcrumbsModule } from '@mixcore/ui/breadcrumbs';
import { MixButtonComponent } from '@mixcore/ui/button';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { EditorMenuComponent } from '../component/editor-menu/editor-menu.component';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: '💀 Git convention',
    children: [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Fruit loops' }],
  },
  {
    name: '💀 Naming convention',
    children: [
      {
        name: 'Green',
        children: [{ name: 'Broccoli' }, { name: 'Brussels sprouts' }],
      },
      {
        name: 'Orange',
        children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
      },
    ],
  },
];
@Component({
  selector: 'wikis',
  standalone: true,
  imports: [
    CommonModule,
    CdkTreeModule,
    EditorMenuComponent,
    CdkNestedTreeNode,
    MixBreadcrumbsModule,
    MixButtonComponent,
  ],
  templateUrl: './wikis.component.html',
  styleUrl: './wikis.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class WikisComponent extends BasePageComponent {
  @ViewChild('editorEl') public editorEl!: ElementRef<HTMLElement>;
  @ViewChild('editorMenu') public editorMenu!: ElementRef<HTMLElement>;
  public editor!: Editor;
  treeControl = new NestedTreeControl<FoodNode>((node) => node.children);
  public cdr = inject(ChangeDetectorRef);
  public treeData = TREE_DATA;
  public dataSource = new ArrayDataSource(this.treeData);

  public hasChild = (_: number, node: FoodNode) =>
    !!node.children && node.children.length > 0;

  public addNew() {
    this.treeData.push({
      name: 'New',
      children: [
        {
          name: 'child 1',
        },
      ],
    });

    this.dataSource.disconnect();
    this.dataSource = new ArrayDataSource(this.treeData);
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();

    this.editor = new Editor({
      element: this.editorEl.nativeElement,
      extensions: [StarterKit],
      content: '<p>Hello World!</p>',
    });

    this.cdr.detectChanges();
  }
}
