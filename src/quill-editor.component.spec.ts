import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';

import { QuillEditorComponent } from '../src/quill-editor.component';

import * as QuillNamespace from 'quill';
import { QuillModule } from './quill.module';
let Quill: any = QuillNamespace;

@Component({
  template: `
<quill-editor [(ngModel)]="title" [customOptions]="[{import: 'attributors/style/size', whitelist: ['14']}]" [style]="style" [required]="required" [minLength]="minLength" [maxLength]="maxLength" [readOnly]="isReadOnly" (onEditorCreated)="handleEditorCreated($event)" (onContentChanged)="handleChange($event);" (onSelectionChanged)="handleSelection($event);"></quill-editor>
`
})
class TestComponent {
  title = 'Hallo';
  isReadOnly = false;
  required = false;
  minLength = 0;
  maxLength = 0;
  style = { height: '30px' };

  changed: any;
  selected: any;

  handleEditorCreated(event: any) {}

  handleChange(event: any) {
    this.changed = event;
  }

  handleSelection(event: any) {
    this.selected = event;
  }
}

@Component({
  template: `
<quill-editor [(ngModel)]="title" [required]="true" [minLength]="minLength" [maxLength]="maxLength" [readOnly]="isReadOnly" (onEditorCreated)="handleEditorCreated($event)" (onContentChanged)="handleChange($event);">
  <div quill-editor-toolbar="true">
    <span class="ql-formats">
      <button class="ql-bold" [title]="'Bold'"></button>
    </span>
    <span class="ql-formats">
      <select class="ql-align" [title]="'Aligment'">
        <option selected></option>
        <option value="center"></option>
        <option value="right"></option>
        <option value="justify"></option>
      </select>
      <select class="ql-align">
        <option selected></option>
        <option value="center"></option>
        <option value="right"></option>
        <option value="justify"></option>
      </select>
    </span>
  </div>
</quill-editor>
`
})
class TestToolbarComponent {
  title = 'Hallo';
  isReadOnly = false;
  minLength = 0;
  maxLength = 0;

  handleEditorCreated(event: any) {}

  handleChange(event: any) {}
}

@Component({
  template: `
    <quill-editor [formControl]='formControl'></quill-editor>
`
})
class ReactiveFormTestComponent {
  formControl: FormControl = new FormControl(null);
  @ViewChild(QuillEditorComponent) editor: QuillEditorComponent;
}

describe('Basic QuillEditorComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        QuillModule.forRoot()
      ]
    });

    this.fixture = TestBed.createComponent(QuillEditorComponent) as ComponentFixture<QuillEditorComponent>;
  });

  it('should render toolbar', async(() => {
    const element = this.fixture.nativeElement;
    this.fixture.detectChanges();
    expect(element.querySelectorAll('div.ql-toolbar.ql-snow').length).toBe(1);
    expect(this.fixture.componentInstance.quillEditor).toBeDefined();
  }));

  it('should render text div', async(() => {
    const element = this.fixture.nativeElement;
    this.fixture.detectChanges();
    expect(element.querySelectorAll('div.ql-container.ql-snow').length).toBe(1);
    expect(this.fixture.componentInstance.quillEditor).toBeDefined();
  }));
});

describe('Reactive forms integration', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReactiveFormTestComponent],
      imports: [FormsModule, ReactiveFormsModule, QuillModule],
    });

    this.fixture = TestBed.createComponent(ReactiveFormTestComponent) as ComponentFixture<ReactiveFormTestComponent>;
    this.fixture.detectChanges();
  });

  it('should be disabled', () => {
    const component = this.fixture.componentInstance;
    component.formControl.disable();
    expect(component.editor.quillEditor.container.classList.contains('ql-disabled')).toBeTruthy();
  });

  it('has "disabled" attribute', () => {
    const component = this.fixture.componentInstance;
    component.formControl.disable();
    expect(this.fixture.nativeElement.children[0].attributes.disabled).toBeDefined();
  });

  it('should re-enable', () => {
    const component = this.fixture.componentInstance;
    component.formControl.disable();

    component.formControl.enable();

    expect(component.editor.quillEditor.container.classList.contains('ql-disabled')).toBeFalsy();
    expect(this.fixture.nativeElement.children[0].attributes.disabled).not.toBeDefined();
  });

  it('should leave form pristine when content of editor changed programmatically', async(() => {
    const values: string[] = [];
    (this.fixture.componentInstance.formControl as FormControl).valueChanges.subscribe(value => values.push(value));
    this.fixture.detectChanges();

    this.fixture.whenStable().then(() => {
      this.fixture.componentInstance.formControl.setValue('1234');
      this.fixture.detectChanges();
      return this.fixture.whenStable();
    }).then(() => {
      expect(this.fixture.nativeElement.querySelector('div.ql-editor').textContent).toEqual('1234');
      expect(this.fixture.componentInstance.formControl.value).toEqual('1234');
      expect(this.fixture.componentInstance.formControl.pristine).toBeTruthy();
      expect(values).toEqual(['1234']);
    });
  }));

  it('should mark form dirty when content of editor changed by user', async(() => {
    const values: string[] = [];
    (this.fixture.componentInstance.formControl as FormControl).valueChanges.subscribe(value => values.push(value));
    this.fixture.detectChanges();

    this.fixture.whenStable().then(() => {
      appendText(this.fixture.nativeElement.querySelector('div.ql-editor'), '1234');
      return new Promise(resolve => setTimeout(resolve, 10));
    }).then(() => {
      this.fixture.detectChanges();
      return this.fixture.whenStable();
    }).then(() => {
      expect(this.fixture.nativeElement.querySelector('div.ql-editor').textContent).toEqual('1234');
      expect(getTextContent(this.fixture.componentInstance.formControl.value)).toEqual('1234');
      expect(this.fixture.componentInstance.formControl.dirty).toBeTruthy();
      expect(values.map(getTextContent)).toEqual(['1234']);
    });
  }));
});

describe('Advanced QuillEditorComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, TestToolbarComponent],
      imports: [FormsModule, QuillModule]
    }).compileComponents();

    this.fixture = TestBed.createComponent(TestComponent) as ComponentFixture<TestComponent>;
  });

  it('should set editor settings', async(() => {
    spyOn(Quill, 'import').and.callThrough();
    spyOn(Quill, 'register').and.callThrough();
    this.fixture.detectChanges();

    const editorElem = this.fixture.debugElement.children[0];
    const editorCmp = this.fixture.debugElement.children[0].componentInstance;

    expect(editorCmp.readOnly).toBe(false);

    this.fixture.componentInstance.isReadOnly = true;
    this.fixture.detectChanges();

    expect(Quill.import).toHaveBeenCalledWith('attributors/style/size');
    expect(Quill.register).toHaveBeenCalled();

    this.fixture.whenStable().then(() => {
      expect(editorCmp.readOnly).toBe(true);
      expect(editorElem.nativeElement.querySelectorAll('div.ql-container.ql-disabled').length).toBe(1);
      expect(editorElem.nativeElement.querySelector('div[quill-editor-element]').style.height).toBe('30px');
    });
  }));

  it('should update editor style', async(() => {
    this.fixture.detectChanges();

    const editorElem = this.fixture.debugElement.children[0];

    this.fixture.componentInstance.style = { backgroundColor: 'red' };
    this.fixture.detectChanges();

    this.fixture.whenStable().then(() => {
      expect(editorElem.nativeElement.querySelector('div[quill-editor-element]').style.backgroundColor).toBe('red');
      expect(editorElem.nativeElement.querySelector('div[quill-editor-element]').style.height).toEqual('');
    });
  }));

  it('should update editor style to null and readd styling', async(() => {
    this.fixture.detectChanges();

    const editorElem = this.fixture.debugElement.children[0];

    this.fixture.componentInstance.style = null;
    this.fixture.detectChanges();

    this.fixture.whenStable().then(() => {
      this.fixture.componentInstance.style = {color: 'red'};
      expect(editorElem.nativeElement.querySelector('div[quill-editor-element]').style.height).toEqual('');
      this.fixture.detectChanges();
      return this.fixture.whenStable();
    }).then(() => {
      expect(editorElem.nativeElement.querySelector('div[quill-editor-element]').style.color).toBe('red');
    });
  }));

  it('should not update editor style if nothing changed', async(() => {
    this.fixture.detectChanges();

    const editorElem = this.fixture.debugElement.children[0];

    this.fixture.componentInstance.readOnly = true;
    this.fixture.detectChanges();

    this.fixture.whenStable().then(() => {
      expect(editorElem.nativeElement.querySelector('div[quill-editor-element]').style.height).toEqual('30px');
    });
  }));

  it('should set touched state correctly', async(() => {
    this.fixture.detectChanges();

    const editorFixture = this.fixture.debugElement.children[0];

    editorFixture.componentInstance.quillEditor.focus();
    editorFixture.componentInstance.quillEditor.blur();
    this.fixture.detectChanges();

    expect(editorFixture.nativeElement.className).toMatch('ng-touched');
  }));

  it('should set required state correctly', async(() => {
    // get editor component
    const editorElement = this.fixture.debugElement.children[0].nativeElement;

    this.fixture.componentInstance.title = '';
    this.fixture.detectChanges();
    this.fixture.whenStable().then(() => {
      expect(editorElement.className).toMatch('ng-valid');
    });
  }));

  it('should emit onEditorCreated with editor instance', async(() => {
    spyOn(this.fixture.componentInstance, 'handleEditorCreated');
    this.fixture.detectChanges();
    const editorComponent = this.fixture.debugElement.children[0].componentInstance;
    expect(this.fixture.componentInstance.handleEditorCreated).toHaveBeenCalledWith(editorComponent.quillEditor);
  }));

  it('should emit onContentChanged when content of editor changed programmatically', async(() => {
    spyOn(this.fixture.componentInstance, 'handleChange').and.callThrough();
    this.fixture.detectChanges();
    this.fixture.whenStable().then(() => {
      this.fixture.componentInstance.title = '1234';
      this.fixture.detectChanges();
      return this.fixture.whenStable();
    }).then(() => {
      expect(this.fixture.nativeElement.querySelector('div.ql-editor').textContent).toEqual('1234');
      expect(this.fixture.componentInstance.handleChange).toHaveBeenCalledWith(this.fixture.componentInstance.changed);
    });
  }));

  it('should emit onContentChanged when content of editor changed by user', async(() => {
    spyOn(this.fixture.componentInstance, 'handleChange').and.callThrough();
    this.fixture.detectChanges();
    this.fixture.whenStable().then(() => {
      appendText(this.fixture.nativeElement.querySelector('div.ql-editor'), '1234');
      return new Promise(resolve => setTimeout(resolve, 10));
    }).then(() => {
      this.fixture.detectChanges();
      return this.fixture.whenStable();
    }).then(() => {
      expect(this.fixture.nativeElement.querySelector('div.ql-editor').textContent).toEqual('Hallo1234');
      expect(this.fixture.componentInstance.handleChange).toHaveBeenCalledWith(this.fixture.componentInstance.changed);
    });
  }));

  it('should emit onSelectionChanged when selection changed', async(() => {
    spyOn(this.fixture.componentInstance, 'handleSelection').and.callThrough();
    this.fixture.detectChanges();

    const editorFixture = this.fixture.debugElement.children[0];

    editorFixture.componentInstance.quillEditor.focus();
    editorFixture.componentInstance.quillEditor.blur();
    this.fixture.detectChanges();

    expect(this.fixture.componentInstance.handleSelection).toHaveBeenCalledWith(this.fixture.componentInstance.selected);
  }));

  it('should validate minlength', async(() => {
    // get editor component
    const editorComponent = this.fixture.debugElement.children[0].componentInstance;
    const editorElement = this.fixture.debugElement.children[0].nativeElement;

    this.fixture.detectChanges();
    this.fixture.whenStable().then(() => {
      expect(editorElement.className).toMatch('ng-valid');

      // set minlength
      this.fixture.componentInstance.minLength = 8;
      this.fixture.componentInstance.title = 'Hallo1';

      this.fixture.detectChanges();

      return this.fixture.whenStable();
    }).then(() => {
      this.fixture.detectChanges();
      expect(editorComponent.minLength).toBe(8);
      expect(editorElement.className).toMatch('ng-invalid');
    });
  }));

  it('should set valid minlength if model is empty', async(() => {
    // get editor component
    const editorComponent = this.fixture.debugElement.children[0].componentInstance;
    const editorElement = this.fixture.debugElement.children[0].nativeElement;

    this.fixture.detectChanges();
    this.fixture.whenStable().then(() => {
      // set min length
      editorComponent.minLength = 2;
      // change text
      editorComponent.quillEditor.setText('');

      this.fixture.detectChanges();
      return this.fixture.whenStable();
    }).then(() => {
      this.fixture.detectChanges();
      expect(editorElement.className).toMatch('ng-valid');
    });
  }));

  it('should validate maxlength', async(() => {
    // get editor component
    const editorComponent = this.fixture.debugElement.children[0].componentInstance;
    const editorElement = this.fixture.debugElement.children[0].nativeElement;

    this.fixture.detectChanges();
    this.fixture.whenStable().then(() => {
      expect(this.fixture.debugElement.children[0].nativeElement.className).toMatch('ng-valid');

      this.fixture.componentInstance.maxLength = 3;
      this.fixture.componentInstance.title = '1234';
      this.fixture.detectChanges();

      return this.fixture.whenStable();
    }).then(() => {
      this.fixture.detectChanges();

      expect(editorComponent.maxLength).toBe(3);
      expect(editorElement.className).toMatch('ng-invalid');
    });
  }));

  it('should validate maxlength and minlength', async(() => {
    // get editor component
    const editorElement = this.fixture.debugElement.children[0].nativeElement;

    this.fixture.detectChanges();
    this.fixture.whenStable().then(() => {
      expect(this.fixture.debugElement.children[0].nativeElement.className).toMatch('ng-valid');

      this.fixture.componentInstance.minLength = 3;
      this.fixture.componentInstance.maxLength = 5;
      this.fixture.componentInstance.title = '123456';

      this.fixture.detectChanges();
      return this.fixture.whenStable();
    }).then(() => {
      this.fixture.detectChanges();
      expect(editorElement.className).toMatch('ng-invalid');

      this.fixture.componentInstance.title = '1234';

      this.fixture.detectChanges();
      return this.fixture.whenStable();
    }).then(() => {
      this.fixture.detectChanges();
      expect(editorElement.className).toMatch('ng-valid');
    });
  }));

  it('should validate required', async(() => {
    // get editor component
    const editorElement = this.fixture.debugElement.children[0].nativeElement;
    const editorComponent = this.fixture.debugElement.children[0].componentInstance;

    this.fixture.detectChanges();
    this.fixture.whenStable().then(() => {
      expect(this.fixture.debugElement.children[0].nativeElement.className).toMatch('ng-valid');
      expect(editorComponent.required).toBeFalsy();

      this.fixture.componentInstance.required = true;
      this.fixture.componentInstance.title = '';

      this.fixture.detectChanges();
      return this.fixture.whenStable();
    }).then(() => {
      this.fixture.detectChanges();

      expect(editorComponent.required).toBeTruthy();
      expect(editorElement.className).toMatch('ng-invalid');

      this.fixture.componentInstance.title = '1';

      this.fixture.detectChanges();
      return this.fixture.whenStable();
    }).then(() => {
      this.fixture.detectChanges();
      expect(editorElement.className).toMatch('ng-valid');
    });
  }));

  it('should add custom toolbar', async(() => {
    // get editor component
    this.fixture = TestBed.createComponent(TestToolbarComponent) as ComponentFixture<TestToolbarComponent>;

    this.fixture.detectChanges();
    expect(this.fixture.nativeElement.querySelector('[quill-editor-toolbar]').querySelector('span[title=Alignment]')).toBeDefined();

    const editorComponent = this.fixture.debugElement.children[0].componentInstance;
    expect(editorComponent.required).toBe(true);
  }));
});

describe('QuillEditor - base config', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, TestToolbarComponent],
      imports: [FormsModule, QuillModule.forRoot({
        modules: {
          toolbar: [
            ['bold']
          ]
        }
      })]
    }).compileComponents();
  });

  it('renders editor with root toolbar config', () => {
    this.fixture = TestBed.createComponent(TestComponent) as ComponentFixture<TestComponent>;
    this.fixture.detectChanges();

    expect(this.fixture.nativeElement.querySelector('.ql-toolbar').querySelectorAll('button').length).toBe(1);
    expect(this.fixture.nativeElement.querySelector('.ql-toolbar').querySelector('button.ql-bold')).toBeDefined();
  });
});

function appendText(el: HTMLElement, str: string) {
  if (document.activeElement !== el) {
    el.focus();
  }

  const sel = window.getSelection();
  sel.removeAllRanges();

  const range = document.createRange();
  range.setStart(el, el.childNodes.length);
  range.setEnd(el, el.childNodes.length);
  sel.addRange(range);

  range.insertNode(document.createTextNode(str));

  const ev = document.createEvent('Event');
  ev.initEvent('input', true, true);
  el.dispatchEvent(ev);
}

function getTextContent(str: string): string {
  const el = document.createElement('div');
  el.innerHTML = str;
  return el.textContent;
}
