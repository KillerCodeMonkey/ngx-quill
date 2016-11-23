import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, Output, ViewEncapsulation } from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';

var Quill = require('quill/dist/quill');

@Component({
  selector: 'quill-editor',
  template: `
<div class="editor-container"></div>
`,
  styleUrls: ['quill-editor.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => QuillEditorComponent),
    multi: true
  }],
  encapsulation: ViewEncapsulation.None
})
export class QuillEditorComponent implements AfterViewInit, ControlValueAccessor {

  quillEditor: any;
  toolbar: true;
  editorElem: HTMLElement;
  content: any;

  @Input() toolbarConfig: any;
  @Input() theme: string;
  @Input() readOnly: boolean;
  @Input() placeholder: string;
  @Input() formats: string[];

  @Output() onEditorCreated: EventEmitter<any> = new EventEmitter();
  @Output() onContentChanged: EventEmitter<any> = new EventEmitter();

  onModelChange: Function = () => {};
  onModelTouched: Function = () => {};

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit() {
    this.editorElem = this.elementRef.nativeElement.getElementsByClassName('editor-container')[0];

    this.quillEditor = new Quill(this.editorElem, {
      modules: {
        toolbar: this.toolbarConfig || [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],

          [{ 'header': 1 }, { 'header': 2 }],               // custom button values
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
          [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
          [{ 'direction': 'rtl' }],                         // text direction

          [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

          [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
          [{ 'font': [] }],
          [{ 'align': [] }],

          ['clean'],                                         // remove formatting button

          ['link', 'image']                                  // link and image
        ]
      },
      placeholder: this.placeholder || 'Insert text here ...',
      readOnly: this.readOnly || false,
      theme: this.theme || 'snow',
      formats: this.formats,
      boundary: document.body
    });

    if (this.content) {
      this.quillEditor.pasteHTML(this.content);
    }

    this.onEditorCreated.emit(this.quillEditor);

    this.quillEditor.on('text-change', () => {
      let html = this.editorElem.children[0].innerHTML;
      const text = this.quillEditor.getText();

      if (html === '<p><br></p>') {
          html = null;
      }

      this.onContentChanged.emit({
        editor: this.quillEditor,
        html: html,
        text: text
      });

      this.onModelChange(html);
    });
  }

  writeValue(currentValue: any) {
    this.content = currentValue;

    if (this.quillEditor) {
      if (currentValue) {
        this.quillEditor.pasteHTML(currentValue);
      } else {
        this.quillEditor.setText('');
      }
    }
  }

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }
}
