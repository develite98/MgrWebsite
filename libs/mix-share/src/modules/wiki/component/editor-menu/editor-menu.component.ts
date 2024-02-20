import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { MixCheckboxComponent } from '@mixcore/ui/checkbox';
import { Editor } from '@tiptap/core';
import {
  BubbleMenuPlugin,
  BubbleMenuPluginProps,
} from '@tiptap/extension-bubble-menu';

import {
  FloatingMenuPlugin,
  FloatingMenuPluginProps,
} from '@tiptap/extension-floating-menu';

@Component({
  selector: 'mix-editor-menu',
  standalone: true,
  templateUrl: './editor-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MixCheckboxComponent],
})
export class EditorMenuComponent {
  @ViewChild('floatingMenu') public floatingMenu!: ElementRef<HTMLElement>;
  @ViewChild('bubbleMenu') public bubbleMenu!: ElementRef<HTMLElement>;

  @Input() bubblePluginKey: BubbleMenuPluginProps['pluginKey'] =
    'bubblePluginKey';
  @Input() floatingPluginKey: FloatingMenuPluginProps['pluginKey'] =
    'floatingPluginKey';

  @Input() public editor!: Editor;

  public actions = [
    // Header
    {
      name: 'Heading 1',
      icon: 'format_h1',
      click: () =>
        this.editor?.chain().focus().toggleHeading({ level: 2 }).run(),
      active: () => this.editor.isActive('heading', { level: 2 }),
    },
    {
      name: 'Heading 2',
      icon: 'format_h2',
      click: () =>
        this.editor?.chain().focus().toggleHeading({ level: 3 }).run(),
      active: () => this.editor.isActive('heading', { level: 3 }),
    },
    {
      name: 'Heading 3',
      icon: 'format_h3',
      click: () =>
        this.editor?.chain().focus().toggleHeading({ level: 4 }).run(),
      active: () => this.editor.isActive('heading', { level: 4 }),
    },
    // Text style
    {
      name: 'Bold',
      icon: 'format_bold',
      click: () => this.editor?.chain().focus().toggleBold().run(),
      active: () => this.editor.isActive('bold'),
    },
    {
      name: 'Italic',
      icon: 'format_italic',
      click: () => this.editor?.chain().focus().toggleItalic().run(),
      active: () => this.editor.isActive('italic'),
    },
    {
      name: 'Strike',
      icon: 'format_italic',
      click: () => this.editor?.chain().focus().toggleStrike().run(),
      active: () => this.editor.isActive('strike'),
    },
  ];

  ngAfterViewInit() {
    this.editor.registerPlugin(
      FloatingMenuPlugin({
        pluginKey: this.floatingPluginKey,
        editor: this.editor,
        element: this.floatingMenu.nativeElement,
        tippyOptions: {
          duration: 0,
          delay: 0,
          animation: undefined,
          appendTo: 'parent',
        },
      })
    );

    this.editor.registerPlugin(
      BubbleMenuPlugin({
        pluginKey: this.bubblePluginKey,
        editor: this.editor,
        element: this.bubbleMenu.nativeElement,
        tippyOptions: {
          duration: 0,
          delay: 0,
          animation: undefined,
          appendTo: 'parent',
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.editor.unregisterPlugin(this.floatingPluginKey);
    this.editor.unregisterPlugin(this.bubblePluginKey);
  }
}
