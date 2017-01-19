import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';

import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ControlValueAccessor,
  FormControl,
  Validator
} from '@angular/forms';

import * as Quill from 'quill';

// function createMinMaxValidator(minLength: number, maxLength: number, quillEditor: any) {
//   return function validateMinMax(c: FormControl) {
//     let err: {
//           minLengthError?: {given: number, minLength: number};
//           maxLengthError?: {given: number, maxLength: number};
//         } = {},
//         valid = true;

//     const textLength = quillEditor.getText().trim().length;

//     if (minLength) {
//       err.minLengthError = {
//         given: textLength,
//         minLength: minLength
//       };

//       valid = textLength >= minLength;
//     }

//     if (maxLength) {
//       err.maxLengthError = {
//         given: textLength,
//         maxLength: maxLength
//       };

//       valid = textLength < maxLength;
//     }

//     return valid ? null : err;
//   };
// }

@Component({
  selector: 'quill-editor',
  template: `
<div></div>
`,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => QuillEditorComponent),
    multi: true
  }, { 
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => QuillEditorComponent),
    multi: true
  }],
  styles: [`
    .ql-container .ql-editor {
      min-height: 200px;
      padding-bottom: 50px;
    }
  `],
  encapsulation: ViewEncapsulation.None
})
export class QuillEditorComponent implements AfterViewInit, ControlValueAccessor, OnChanges, Validator {

  quillEditor: any;
  editorElem: HTMLElement;
  emptyArray: any[] = [];
  // validateFn: Function = ():any => null;
  content: any;
  defaultModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': this.emptyArray.slice() }, { 'background': this.emptyArray.slice() }],          // dropdown with defaults from theme
      [{ 'font': this.emptyArray.slice() }],
      [{ 'align': this.emptyArray.slice() }],

      ['clean'],                                         // remove formatting button

      ['link', 'image', 'video']                         // link and image, video
    ]
  };

  @Input() theme: string;
  @Input() modules: Object;
  @Input() readOnly: boolean;
  @Input() placeholder: string;
  @Input() maxLength: number;
  @Input() minLength: number;
  @Input() formats: string[];

  @Output() onEditorCreated: EventEmitter<any> = new EventEmitter();
  @Output() onContentChanged: EventEmitter<any> = new EventEmitter();

  onModelChange: Function = () => {};
  onModelTouched: Function = () => {};

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit() {
    this.editorElem = this.elementRef.nativeElement.children[0];

    this.quillEditor = new Quill(this.editorElem, {
      modules: this.modules || this.defaultModules,
      placeholder: this.placeholder || 'Insert text here ...',
      readOnly: this.readOnly || false,
      theme: this.theme || 'snow',
      formats: this.formats
    });

    //this.validateFn = createMinMaxValidator(this.minLength, this.maxLength, this.quillEditor);

    if (this.content) {
      this.quillEditor.pasteHTML(this.content);
    }

    this.onEditorCreated.emit(this.quillEditor);

    // mark model as touched if editor lost focus
    this.quillEditor.on('selection-change', (range: any) => {
      if (!range) {
        this.onModelTouched();
      }
    });

    // update model if text changes
    this.quillEditor.on('text-change', (delta: any, oldDelta: any) => {
      let html = this.editorElem.children[0].innerHTML;
      const text = this.quillEditor.getText();

      if (html === '<p><br></p>') {
          html = null;
      }

      this.onModelChange(html);

      this.onContentChanged.emit({
        editor: this.quillEditor,
        html: html,
        text: text
      });
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    let min: number;
    let max: number;

    if (changes['readOnly'] && this.quillEditor) {
      this.quillEditor.enable(!changes['readOnly'].currentValue);
    }

    if (this.quillEditor) {
      if (changes['minLength']) {
        min = changes['minLength'].currentValue;
      }

      if (changes['maxLength']) {
        max = changes['maxLength'].currentValue;
      }

      //this.validateFn = createMinMaxValidator(min, max, this.quillEditor);
    }
  }

  writeValue(currentValue: any) {
    this.content = currentValue;

    if (this.quillEditor) {
      if (currentValue) {
        this.quillEditor.pasteHTML(currentValue);
        return;
      }
      this.quillEditor.setText('');
    }
  }

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }

  validate(c: FormControl) {
    if (!this.quillEditor) {
      return null;
    }

    let err: {
      minLengthError?: {given: number, minLength: number};
      maxLengthError?: {given: number, maxLength: number};
    } = {},
    valid = true;

    const textLength = this.quillEditor.getText().trim().length;

    if (this.minLength) {
      err.minLengthError = {
        given: textLength,
        minLength: this.minLength
      };

      valid = textLength >= this.minLength;
    }

    if (this.maxLength) {
      err.maxLengthError = {
        given: textLength,
        maxLength: this.maxLength
      };

      valid = textLength < this.maxLength;
    }

    return valid ? null : err;
  }
}
