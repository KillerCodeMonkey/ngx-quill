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

describe('Formats', () => {
  describe('object', () => {
    @Component({
      template: `
    <quill-editor [(ngModel)]="title" format="object" (onEditorCreated)="handleEditorCreated($event);"></quill-editor>
    `
    })
    class ObjectComponent {
      title = [{
        insert: 'Hello'
      }];
      editor: any;

      handleEditorCreated(event: any) {
        this.editor = event;
      }
    }

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ObjectComponent],
        imports: [FormsModule, QuillModule],
      });

      this.fixture = TestBed.createComponent(ObjectComponent) as ComponentFixture<ObjectComponent>;
      this.fixture.detectChanges();
    });
    it('should be set object', async(() => {
      const component = this.fixture.componentInstance;

      this.fixture.whenStable().then(() => {
        expect(JSON.stringify(component.editor.getContents())).toEqual(JSON.stringify({"ops":[{"insert":"Hello\n"}]}));
      });
    }));

    it('should update text', async(() => {
      const component = this.fixture.componentInstance;
      this.fixture.whenStable().then(() => {
        component.title = [{ insert: '1234' }];
        this.fixture.detectChanges();

        return this.fixture.whenStable();
      }).then(() => {
        expect(JSON.stringify(component.editor.getContents())).toEqual(JSON.stringify({"ops":[{"insert":"1234\n"}]}));
      });
    }));

    it('should update model if editor text changes', async(() => {
      const component = this.fixture.componentInstance;

      this.fixture.whenStable().then(() => {
        component.editor.setContents([{ insert: '123' }]);
        this.fixture.detectChanges();

        return this.fixture.whenStable();
      }).then(() => {
        expect(JSON.stringify(component.title)).toEqual(JSON.stringify({"ops":[{"insert":"123\n"}]}));
      });
    }));
  });

  describe('html', () => {
    @Component({
      template: `
    <quill-editor [(ngModel)]="title" format="html" (onEditorCreated)="handleEditorCreated($event);"></quill-editor>
    `
    })
    class HTMLComponent {
      title = '<p>Hallo</p>';
      editor: any;

      handleEditorCreated(event: any) {
        this.editor = event;
      }
    }

    @Component({
      template: `
    <quill-editor [(ngModel)]="title" [sanitize]="true" format="html" (onEditorCreated)="handleEditorCreated($event);"></quill-editor>
    `
    })
    class HTMLSanitizeComponent {
      title = '<p>Hallo <img src="wroooong.jpg" onerror="window.alert(\'sanitize me\')"></p>';
      editor: any;

      handleEditorCreated(event: any) {
        this.editor = event;
      }
    }

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [HTMLComponent, HTMLSanitizeComponent],
        imports: [FormsModule, QuillModule],
      });

      this.fixture = TestBed.createComponent(HTMLComponent) as ComponentFixture<HTMLComponent>;
      this.fixture.detectChanges();
    });
    it('should be set html', async(() => {
      const component = this.fixture.componentInstance;

      this.fixture.whenStable().then(() => {
        expect(component.editor.getText().trim()).toEqual('Hallo');
      });
    }));

    it('should update html', async(() => {
      const component = this.fixture.componentInstance;
      component.title = '<p>test</p>';
      this.fixture.detectChanges();

      this.fixture.whenStable().then(() => {
        expect(component.editor.getText().trim()).toEqual('test');
      });
    }));

    it('should update model if editor html changes', async(() => {
      const component = this.fixture.componentInstance;
      this.fixture.whenStable().then(() => {
        expect(component.title.trim()).toEqual('<p>Hallo</p>');
        component.editor.setText('1234');
        return this.fixture.detectChanges();
      }).then(() => {
        expect(component.title.trim()).toEqual('<p>1234</p>');
      });


      this.fixture.whenStable().then(() => {

      });
    }));

    it('should sanitize html', async(() => {
      this.fixture = TestBed.createComponent(HTMLSanitizeComponent) as ComponentFixture<HTMLSanitizeComponent>;
      this.fixture.detectChanges();
      const component = this.fixture.componentInstance;

      this.fixture.whenStable().then(() => {
        expect(JSON.stringify(component.editor.getContents())).toEqual(JSON.stringify({"ops":[{"insert":"Hallo "},{"insert":{"image":"wroooong.jpg"}},{"insert":"\n"}]}));

        component.title = '<p><img src="xxxx" onerror="window.alert()"></p>';
        this.fixture.detectChanges();

        return this.fixture.whenStable();
      }).then(() => {
        expect(JSON.stringify(component.editor.getContents())).toEqual(JSON.stringify({"ops":[{"insert":{"image":"xxxx"}},{"insert":"\n"}]}));
      });
    }));
  });

  describe('text', () => {
    @Component({
      template: `
    <quill-editor [(ngModel)]="title" format="text" (onEditorCreated)="handleEditorCreated($event);"></quill-editor>
    `
    })
    class TextComponent {
      title = 'Hallo';
      editor: any;

      handleEditorCreated(event: any) {
        this.editor = event;
      }
    }

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TextComponent],
        imports: [FormsModule, QuillModule],
      });

      this.fixture = TestBed.createComponent(TextComponent) as ComponentFixture<TextComponent>;
      this.fixture.detectChanges();
    });
    it('should be set text', async(() => {
      const component = this.fixture.componentInstance;
      this.fixture.whenStable().then(() => {
        expect(component.editor.getText().trim()).toEqual('Hallo');
      });
    }));

    it('should update text', async(() => {
      const component = this.fixture.componentInstance;
      component.title = 'test';
      this.fixture.detectChanges();

      this.fixture.whenStable().then(() => {
        expect(component.editor.getText().trim()).toEqual('test');
      });
    }));

    it('should update model if editor text changes', async(() => {
      const component = this.fixture.componentInstance;
      this.fixture.whenStable().then(() => {
        component.editor.setText('123');
        this.fixture.detectChanges();
        return this.fixture.whenStable();
      }).then(() => {
        expect(component.title.trim()).toEqual('123');
      });
    }));
  });

  describe('json', () => {
    @Component({
      template: `
    <quill-editor [(ngModel)]="title" format="json" (onEditorCreated)="handleEditorCreated($event);"></quill-editor>
    `
    })
    class JSONComponent {
      title = JSON.stringify([{
        insert: 'Hallo'
      }]);
      editor: any;

      handleEditorCreated(event: any) {
        this.editor = event;
      }
    }

    @Component({
      template: `
    <quill-editor [(ngModel)]="title" format="json" (onEditorCreated)="handleEditorCreated($event);"></quill-editor>
    `
    })
    class JSONInvalidComponent {
      title = JSON.stringify([{
        insert: 'Hallo'
      }]) + '{';
      editor: any;

      handleEditorCreated(event: any) {
        this.editor = event;
      }
    }

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [JSONComponent, JSONInvalidComponent],
        imports: [FormsModule, QuillModule],
      });

      this.fixture = TestBed.createComponent(JSONComponent) as ComponentFixture<JSONComponent>;
      this.fixture.detectChanges();
    });

    it('should set json string', async(() => {
      const component = this.fixture.componentInstance;
      this.fixture.whenStable().then(() => {
        expect(JSON.stringify(component.editor.getContents())).toEqual(JSON.stringify({"ops":[{"insert":"Hallo\n"}]}));
      });
    }));

    it('should update json string', async(() => {
      const component = this.fixture.componentInstance;
      component.title = JSON.stringify([{
        insert: 'Hallo 123'
      }]);
      this.fixture.detectChanges();
      this.fixture.whenStable().then(() => {
        expect(JSON.stringify(component.editor.getContents())).toEqual(JSON.stringify({"ops":[{"insert":"Hallo 123\n"}]}));
      });
    }));

    it('should update model if editor changes', async(() => {
      const component = this.fixture.componentInstance;

      this.fixture.whenStable().then(() => {

        component.editor.setContents([{
          insert: 'Hallo 123'
        }]);
        this.fixture.detectChanges();
        return this.fixture.whenStable();
      }).then(() => {
        expect(component.title).toEqual(JSON.stringify({"ops":[{"insert":"Hallo 123\n"}]}));
      });
    }));

    it('should set as text if invalid JSON', async(() => {
      this.fixture = TestBed.createComponent(JSONInvalidComponent) as ComponentFixture<JSONInvalidComponent>;
      this.fixture.detectChanges();
      const component = this.fixture.componentInstance;
      this.fixture.whenStable().then(() => {
        expect(component.editor.getText().trim()).toEqual(JSON.stringify([{
          insert: 'Hallo'
        }]) + '{');

        component.title = JSON.stringify([{
          insert: 'Hallo 1234'
        }]) + '{';
        this.fixture.detectChanges();
        return this.fixture.whenStable();
      }).then(() => {
        expect(component.editor.getText().trim()).toEqual(JSON.stringify([{
          insert: 'Hallo 1234'
        }]) + '{');
      });
    }));
  });
});

describe('Dynamic styles', () => {
  @Component({
    template: `
  <quill-editor [bounds]="'self'" [(ngModel)]="title" format="text" [style]="style" (onEditorCreated)="handleEditorCreated($event);"></quill-editor>
  `
  })
  class StylingComponent {
    title = 'Hallo';
    style = {
      backgroundColor: 'red'
    };
    editor: any;

    handleEditorCreated(event: any) {
      this.editor = event;
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StylingComponent],
      imports: [FormsModule, QuillModule],
    });

    this.fixture = TestBed.createComponent(StylingComponent) as ComponentFixture<StylingComponent>;
    this.fixture.detectChanges();
  });

  it('set inital style', async(() => {
    const component = this.fixture.componentInstance;
    this.fixture.whenStable().then(() => {
      expect(component.editor.container.style.backgroundColor).toEqual('red');
    });
  }));

  it('set style', async(() => {
    const component = this.fixture.componentInstance;
    this.fixture.whenStable().then(() => {
      component.style = {
        backgroundColor: 'gray'
      };
      this.fixture.detectChanges();
      return this.fixture.whenStable();
    }).then(() => {
      expect(component.editor.container.style.backgroundColor).toEqual('gray');
    });
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

  it('should emit onContentChanged when content of editor changed', async(() => {
    spyOn(this.fixture.componentInstance, 'handleChange').and.callThrough();
    this.fixture.detectChanges();
    this.fixture.whenStable().then(() => {
      this.fixture.componentInstance.title = '1234';
      return this.fixture.detectChanges();
    }).then(() => {
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
