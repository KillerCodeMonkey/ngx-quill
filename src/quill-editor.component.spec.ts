import {Component, Renderer2, ViewChild} from '@angular/core'
import {async, ComponentFixture, TestBed} from '@angular/core/testing'

import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms'

import {QuillEditorComponent} from '../src/quill-editor.component'

import * as QuillNamespace from 'quill'
import {QuillModule} from './quill.module'

const Quill: any = QuillNamespace

@Component({
  template: `
<quill-editor (onBlur)="blured = true" (onFocus)="focused = true" [(ngModel)]="title" [customOptions]="[{import: 'attributors/style/size', whitelist: ['14']}]" [styles]="style" [required]="required" [minLength]="minLength" [maxLength]="maxLength" [readOnly]="isReadOnly" (onEditorCreated)="handleEditorCreated($event)" (onEditorChanged)="handleEditorChange($event)" (onContentChanged)="handleChange($event)" (onSelectionChanged)="handleSelection($event)"></quill-editor>
`
})
class TestComponent {
  title: any = 'Hallo'
  isReadOnly = false
  required = false
  minLength = 0
  focused = false
  blured = false
  maxLength = 0
  style: {
    backgroundColor?: string
    color?: string
    height?: string
  } | null = { height: '30px' }
  editor: any

  changed: any
  changedEditor: any
  selected: any

  handleEditorCreated(event: any) {
    this.editor = event
  }

  handleChange(event: any) {
    this.changed = event
  }

  handleEditorChange(event: any) {
    this.changedEditor = event
  }

  handleSelection(event: any) {
    this.selected = event
  }
}

@Component({
  template: `
<quill-editor [customToolbarPosition]="toolbarPosition" [(ngModel)]="title" [required]="true" [minLength]="minLength" [maxLength]="maxLength" [readOnly]="isReadOnly" (onEditorCreated)="handleEditorCreated($event)" (onContentChanged)="handleChange($event)">
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
  title = 'Hallo'
  isReadOnly = false
  minLength = 0
  maxLength = 0
  toolbarPosition = 'top'

  handleEditorCreated(_event: any) {}
  handleChange(_event: any) {}
}

@Component({
  template: `
    <quill-editor [formControl]='formControl'></quill-editor>
`
})
class ReactiveFormTestComponent {
  formControl: FormControl = new FormControl(null)
  @ViewChild(QuillEditorComponent, { static: true }) editor!: QuillEditorComponent
}

@Component({
  template: `
    <quill-editor [ngModel]="content" [preserveWhitespace]="true"></quill-editor>
`
})
class PreserveWhitespaceTestComponent {
  content = '<p>test     test   </p>'
  @ViewChild(QuillEditorComponent, { static: true }) editor!: QuillEditorComponent
}

describe('Basic QuillEditorComponent', () => {
  let fixture: ComponentFixture<QuillEditorComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        QuillModule
      ],
      providers: QuillModule.forRoot().providers
    })

    fixture = TestBed.createComponent(QuillEditorComponent)
  })

  it('ngOnDestroy - removes listeners', () => {
    fixture.detectChanges()
    const spy = spyOn(fixture.componentInstance.quillEditor, 'off').and.callThrough()

    fixture.componentInstance.ngOnDestroy()

    expect(spy).toHaveBeenCalledTimes(3)
  })

  it('should render toolbar', async(async () => {
    const element = fixture.nativeElement
    fixture.detectChanges()
    await fixture.whenStable()

    expect(element.querySelectorAll('div.ql-toolbar.ql-snow').length).toBe(1)
    expect(fixture.componentInstance.quillEditor).toBeDefined()
  }))

  it('should render text div', async(async () => {
    const element = fixture.nativeElement
    fixture.detectChanges()
    await fixture.whenStable()

    expect(element.querySelectorAll('div.ql-container.ql-snow').length).toBe(1)
    expect(fixture.componentInstance.quillEditor).toBeDefined()
  }))
})

describe('Formats', () => {
  describe('object', () => {
    @Component({
      template: `
    <quill-editor [(ngModel)]="title" format="object" (onEditorCreated)="handleEditorCreated($event)"></quill-editor>
    `
    })
    class ObjectComponent {
      title = [{
        insert: 'Hello'
      }]
      editor: any

      handleEditorCreated(event: any) {
        this.editor = event
      }
    }

    let fixture: ComponentFixture<ObjectComponent>

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ObjectComponent],
        imports: [FormsModule, QuillModule],
        providers: QuillModule.forRoot().providers
      })

      fixture = TestBed.createComponent(ObjectComponent) as ComponentFixture<ObjectComponent>
      fixture.detectChanges()
    })
    it('should be set object', async(async () => {
      const component = fixture.componentInstance

      await fixture.whenStable()
      expect(JSON.stringify(component.editor.getContents())).toEqual(JSON.stringify({ops: [{insert: 'Hello\n'}]}))
    }))

    it('should update text', async(async () => {
      const component = fixture.componentInstance
      await fixture.whenStable()
      component.title = [{ insert: '1234' }]
      fixture.detectChanges()

      await fixture.whenStable()
      expect(JSON.stringify(component.editor.getContents())).toEqual(JSON.stringify({ops: [{insert: '1234\n'}]}))
    }))

    it('should update model if editor text changes', async(() => {
      const component = fixture.componentInstance

      fixture.whenStable().then(() => {
        component.editor.setContents([{ insert: '123' }], 'user')
        fixture.detectChanges()

        return fixture.whenStable()
      }).then(() => {
        expect(JSON.stringify(component.title)).toEqual(JSON.stringify({ops: [{insert: '123\n'}]}))
      })
    }))
  })

  describe('html', () => {
    @Component({
      template: `
    <quill-editor [(ngModel)]="title" format="html" (onEditorCreated)="handleEditorCreated($event)"></quill-editor>
    `
    })
    class HTMLComponent {
      title = '<p>Hallo</p>'
      editor: any

      handleEditorCreated(event: any) {
        this.editor = event
      }
    }

    @Component({
      template: `
    <quill-editor [(ngModel)]="title" [sanitize]="true" format="html" (onEditorCreated)="handleEditorCreated($event)"></quill-editor>
    `
    })
    class HTMLSanitizeComponent {
      title = '<p>Hallo <img src="wroooong.jpg" onerror="window.alert(\'sanitize me\')"></p>'
      editor: any

      handleEditorCreated(event: any) {
        this.editor = event
      }
    }

    let fixture: ComponentFixture<HTMLComponent>

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [HTMLComponent, HTMLSanitizeComponent],
        imports: [FormsModule, QuillModule],
        providers: QuillModule.forRoot().providers
      })

      fixture = TestBed.createComponent(HTMLComponent) as ComponentFixture<HTMLComponent>
      fixture.detectChanges()
    })
    it('should be set html', async(async () => {
      const component = fixture.componentInstance

      await fixture.whenStable()
      expect(component.editor.getText().trim()).toEqual('Hallo')
    }))

    it('should update html', async(async () => {
      const component = fixture.componentInstance
      component.title = '<p>test</p>'
      fixture.detectChanges()

      await fixture.whenStable()
      expect(component.editor.getText().trim()).toEqual('test')
    }))

    it('should update model if editor html changes', async(async () => {
      const component = fixture.componentInstance
      await fixture.whenStable()
      expect(component.title.trim()).toEqual('<p>Hallo</p>')
      component.editor.setText('1234', 'user')
      fixture.detectChanges()
      await fixture.whenStable()
      expect(component.title.trim()).toEqual('<p>1234</p>')
    }))

    it('should sanitize html', async(async () => {
      fixture = TestBed.createComponent(HTMLSanitizeComponent) as ComponentFixture<HTMLSanitizeComponent>
      fixture.detectChanges()
      const component = fixture.componentInstance

      await fixture.whenStable()
      expect(JSON.stringify(component.editor.getContents())).toEqual(JSON.stringify({ops: [{insert: 'Hallo ' }, {insert: {image: 'wroooong.jpg'}}, {insert: '\n'}]}))

      component.title = '<p><img src="xxxx" onerror="window.alert()"></p>'
      fixture.detectChanges()

      await fixture.whenStable()
      expect(JSON.stringify(component.editor.getContents())).toEqual(JSON.stringify({ops: [{insert: {image: 'xxxx'}}, {insert: '\n'}]}))
    }))
  })

  describe('text', () => {
    @Component({
      template: `
    <quill-editor [(ngModel)]="title" format="text" (onEditorCreated)="handleEditorCreated($event)"></quill-editor>
    `
    })
    class TextComponent {
      title = 'Hallo'
      editor: any

      handleEditorCreated(event: any) {
        this.editor = event
      }
    }

    let fixture: ComponentFixture<TextComponent>

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TextComponent],
        imports: [FormsModule, QuillModule],
        providers: QuillModule.forRoot().providers
      })

      fixture = TestBed.createComponent(TextComponent) as ComponentFixture<TextComponent>
      fixture.detectChanges()
    })
    it('should be set text', async(async () => {
      const component = fixture.componentInstance
      await fixture.whenStable()
      expect(component.editor.getText().trim()).toEqual('Hallo')
    }))

    it('should update text', async(async () => {
      const component = fixture.componentInstance
      component.title = 'test'
      fixture.detectChanges()

      await fixture.whenStable()
      expect(component.editor.getText().trim()).toEqual('test')
    }))

    it('should update model if editor text changes', async(async () => {
      const component = fixture.componentInstance
      await fixture.whenStable()
      component.editor.setText('123', 'user')
      fixture.detectChanges()
      await fixture.whenStable()
      expect(component.title.trim()).toEqual('123')
    }))

    it('should not update model if editor content changed by api', async(async () => {
      const component = fixture.componentInstance
      await fixture.whenStable()
      component.editor.setText('123')
      fixture.detectChanges()
      await fixture.whenStable()
      expect(component.title.trim()).toEqual('Hallo')
    }))
  })

  describe('json', () => {
    @Component({
      template: `
    <quill-editor [(ngModel)]="title" format="json" (onEditorCreated)="handleEditorCreated($event)"></quill-editor>
    `
    })
    class JSONComponent {
      title = JSON.stringify([{
        insert: 'Hallo'
      }])
      editor: any

      handleEditorCreated(event: any) {
        this.editor = event
      }
    }

    @Component({
      template: `
    <quill-editor [(ngModel)]="title" format="json" (onEditorCreated)="handleEditorCreated($event)"></quill-editor>
    `
    })
    class JSONInvalidComponent {
      title = JSON.stringify([{
        insert: 'Hallo'
      }]) + '{'
      editor: any

      handleEditorCreated(event: any) {
        this.editor = event
      }
    }

    let fixture: ComponentFixture<JSONComponent>

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [JSONComponent, JSONInvalidComponent],
        imports: [FormsModule, QuillModule],
        providers: QuillModule.forRoot().providers
      })

      fixture = TestBed.createComponent(JSONComponent) as ComponentFixture<JSONComponent>
      fixture.detectChanges()
    })

    it('should set json string', async(async () => {
      const component = fixture.componentInstance
      await fixture.whenStable()
      expect(JSON.stringify(component.editor.getContents())).toEqual(JSON.stringify({ops: [{insert: 'Hallo\n'}]}))
    }))

    it('should update json string', async(async () => {
      const component = fixture.componentInstance
      component.title = JSON.stringify([{
        insert: 'Hallo 123'
      }])
      fixture.detectChanges()
      await fixture.whenStable()
      expect(JSON.stringify(component.editor.getContents())).toEqual(JSON.stringify({ops: [{insert: 'Hallo 123\n'}]}))
    }))

    it('should update model if editor changes', async(async () => {
      const component = fixture.componentInstance

      await fixture.whenStable()

      component.editor.setContents([{
        insert: 'Hallo 123'
      }], 'user')
      fixture.detectChanges()
      await fixture.whenStable()

      expect(component.title).toEqual(JSON.stringify({ops: [{insert: 'Hallo 123\n'}]}))
    }))

    it('should set as text if invalid JSON', async(async () => {
      fixture = TestBed.createComponent(JSONInvalidComponent) as ComponentFixture<JSONInvalidComponent>
      fixture.detectChanges()
      const component = fixture.componentInstance
      await fixture.whenStable()
      expect(component.editor.getText().trim()).toEqual(JSON.stringify([{
        insert: 'Hallo'
      }]) + '{')

      component.title = JSON.stringify([{
        insert: 'Hallo 1234'
      }]) + '{'
      fixture.detectChanges()
      await fixture.whenStable()
      expect(component.editor.getText().trim()).toEqual(JSON.stringify([{
        insert: 'Hallo 1234'
      }]) + '{')
    }))
  })
})

describe('Dynamic styles', () => {
  @Component({
    template: `
  <quill-editor [bounds]="'self'" [(ngModel)]="title" format="text" [styles]="style" (onEditorCreated)="handleEditorCreated($event)"></quill-editor>
  `
  })
  class StylingComponent {
    title = 'Hallo'
    style = {
      backgroundColor: 'red'
    }
    editor: any

    handleEditorCreated(event: any) {
      this.editor = event
    }
  }

  let fixture: ComponentFixture<StylingComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StylingComponent],
      imports: [FormsModule, QuillModule],
      providers: QuillModule.forRoot().providers
    })

    fixture = TestBed.createComponent(StylingComponent) as ComponentFixture<StylingComponent>
    fixture.detectChanges()
  })

  it('set inital styles', async(() => {
    const component = fixture.componentInstance
    fixture.whenStable().then(() => {
      expect(component.editor.container.style.backgroundColor).toEqual('red')
    })
  }))

  it('set style', async(() => {
    const component = fixture.componentInstance
    fixture.whenStable().then(() => {
      component.style = {
        backgroundColor: 'gray'
      }
      fixture.detectChanges()
      return fixture.whenStable()
    }).then(() => {
      expect(component.editor.container.style.backgroundColor).toEqual('gray')
    })
  }))
})

describe('Dynamic classes', () => {
  @Component({
    template: `
  <quill-editor [bounds]="'self'" [(ngModel)]="title" format="text" [classes]="classes" (onEditorCreated)="handleEditorCreated($event)"></quill-editor>
  `
  })
  class ClassesComponent {
    title = 'Hallo'
    classes = 'test-class1 test-class2'
    editor: any
    constructor(public renderer2: Renderer2) {
    }
    handleEditorCreated(event: any) {
      this.editor = event
    }
  }

  let fixture: ComponentFixture<ClassesComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClassesComponent],
      imports: [FormsModule, QuillModule],
      providers: QuillModule.forRoot().providers
    })

    fixture = TestBed.createComponent(ClassesComponent) as ComponentFixture<ClassesComponent>
    fixture.detectChanges()
  })

  it('should set initial classes', async(() => {
    const component = fixture.componentInstance
    fixture.whenStable().then(() => {
      expect(component.editor.container.classList.contains('test-class1')).toBe(true)
      expect(component.editor.container.classList.contains('test-class2')).toBe(true)
    })
  }))

  it('should set class', async(() => {
    const component = fixture.componentInstance
    fixture.whenStable().then(() => {
      component.classes = 'test-class2 test-class3'
      fixture.detectChanges()
      return fixture.whenStable()
    }).then(() => {
      expect(component.editor.container.classList.contains('test-class1')).toBe(false)
      expect(component.editor.container.classList.contains('test-class2')).toBe(true)
      expect(component.editor.container.classList.contains('test-class3')).toBe(true)
    })
  }))
})

describe('Dynamic classes', () => {
  @Component({
    template: `
  <quill-editor [bounds]="'self'" [(ngModel)]="title" format="text" [classes]="classes" (onEditorCreated)="handleEditorCreated($event)"></quill-editor>
  `
  })
  class ClassesComponent {
    title = 'Hallo'
    classes = 'test-class1 test-class2'
    editor: any
    handleEditorCreated(event: any) {
      this.editor = event
    }
  }

  let fixture: ComponentFixture<ClassesComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClassesComponent],
      imports: [FormsModule, QuillModule],
      providers: QuillModule.forRoot().providers
    })

    fixture = TestBed.createComponent(ClassesComponent) as ComponentFixture<ClassesComponent>
    fixture.detectChanges()
  })

  it('set inital classes', async(() => {
    const component = fixture.componentInstance
    fixture.whenStable().then(() => {
      expect(component.editor.container.classList.contains('test-class1')).toBe(true)
      expect(component.editor.container.classList.contains('test-class2')).toBe(true)
    })
  }))

  it('set class', async(() => {
    const component = fixture.componentInstance
    fixture.whenStable().then(() => {
      component.classes = 'test-class2 test-class3'
      fixture.detectChanges()
      return fixture.whenStable()
    }).then(() => {
      expect(component.editor.container.classList.contains('test-class1')).toBe(false)
      expect(component.editor.container.classList.contains('test-class2')).toBe(true)
      expect(component.editor.container.classList.contains('test-class3')).toBe(true)
    })
  }))
})

describe('class normalization function', () => {
  it('should trim white space', () => {
    const classList = QuillEditorComponent.normalizeClassNames('test-class  ')

    expect(classList).toEqual(['test-class'])
  })

  it('should not return empty strings as class names', () => {
    const classList = QuillEditorComponent.normalizeClassNames('test-class   test-class2')

    expect(classList).toEqual(['test-class', 'test-class2'])
  })
})

describe('Reactive forms integration', () => {
  let fixture: ComponentFixture<ReactiveFormTestComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReactiveFormTestComponent],
      imports: [FormsModule, ReactiveFormsModule, QuillModule],
      providers: QuillModule.forRoot().providers
    })

    fixture = TestBed.createComponent(ReactiveFormTestComponent) as ComponentFixture<ReactiveFormTestComponent>
    fixture.detectChanges()
  })

  it('should be disabled', () => {
    const component = fixture.componentInstance
    component.formControl.disable()
    expect(component.editor.quillEditor.container.classList.contains('ql-disabled')).toBeTruthy()
  })

  it('has "disabled" attribute', () => {
    const component = fixture.componentInstance
    component.formControl.disable()
    expect(fixture.nativeElement.children[0].attributes.disabled).toBeDefined()
  })

  it('should re-enable', () => {
    const component = fixture.componentInstance
    component.formControl.disable()

    component.formControl.enable()

    expect(component.editor.quillEditor.container.classList.contains('ql-disabled')).toBeFalsy()
    expect(fixture.nativeElement.children[0].attributes.disabled).not.toBeDefined()
  })

  it('should leave form pristine when content of editor changed programmatically', async(() => {
    const values: string[] = []
    fixture.componentInstance.formControl.valueChanges.subscribe((value: string) => values.push(value))

    fixture.detectChanges()

    fixture.whenStable().then(() => {
      fixture.componentInstance.formControl.patchValue('1234')
      fixture.detectChanges()

      return fixture.whenStable()
    }).then(() => {
      expect(fixture.nativeElement.querySelector('div.ql-editor').textContent).toEqual('1234')
      expect(fixture.componentInstance.formControl.value).toEqual('1234')
      expect(fixture.componentInstance.formControl.pristine).toBeTruthy()
      expect(values).toEqual(['1234'])
    })
  }))

  it('should mark form dirty when content of editor changed by user', async(() => {
    fixture.detectChanges()
    fixture.whenStable().then(() => {
      fixture.componentInstance.editor.quillEditor.setText('1234', 'user')
      fixture.detectChanges()
      return fixture.whenStable()
    }).then(() => {
      expect(fixture.nativeElement.querySelector('div.ql-editor').textContent).toEqual('1234')
      expect(fixture.componentInstance.formControl.dirty).toBeTruthy()
      expect(fixture.componentInstance.formControl.value).toEqual('<p>1234</p>')
    })
  }))
})

describe('Advanced QuillEditorComponent', () => {
  let fixture: ComponentFixture<TestComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, TestToolbarComponent],
      imports: [FormsModule, QuillModule],
      providers: QuillModule.forRoot().providers
    }).compileComponents()

    fixture = TestBed.createComponent(TestComponent) as ComponentFixture<TestComponent>
  })

  it('should set editor settings', async(() => {
    spyOn(Quill, 'import').and.callThrough()
    spyOn(Quill, 'register').and.callThrough()
    fixture.detectChanges()

    const editorElem = fixture.debugElement.children[0]
    const editorCmp = fixture.debugElement.children[0].componentInstance

    expect(editorCmp.readOnly).toBe(false)

    fixture.componentInstance.isReadOnly = true
    fixture.detectChanges()

    expect(Quill.import).toHaveBeenCalledWith('attributors/style/size')
    expect(Quill.register).toHaveBeenCalled()

    fixture.whenStable().then(() => {
      expect(editorCmp.readOnly).toBe(true)
      expect(editorElem.nativeElement.querySelectorAll('div.ql-container.ql-disabled').length).toBe(1)
      expect(editorElem.nativeElement.querySelector('div[quill-editor-element]').style.height).toBe('30px')
    })
  }))

  it('should update editor style', async(() => {
    fixture.detectChanges()

    const editorElem = fixture.debugElement.children[0]

    fixture.componentInstance.style = { backgroundColor: 'red' }
    fixture.detectChanges()

    fixture.whenStable().then(() => {
      expect(editorElem.nativeElement.querySelector('div[quill-editor-element]').style.backgroundColor).toBe('red')
      expect(editorElem.nativeElement.querySelector('div[quill-editor-element]').style.height).toEqual('')
    })
  }))

  it('should update editor style to null and readd styling', async(() => {
    fixture.detectChanges()

    const editorElem = fixture.debugElement.children[0]

    fixture.componentInstance.style = null
    fixture.detectChanges()

    fixture.whenStable().then(() => {
      fixture.componentInstance.style = { color: 'red' }
      expect(editorElem.nativeElement.querySelector('div[quill-editor-element]').style.height).toEqual('')
      fixture.detectChanges()
      return fixture.whenStable()
    }).then(() => {
      expect(editorElem.nativeElement.querySelector('div[quill-editor-element]').style.color).toBe('red')
    })
  }))

  it('should not update editor style if nothing changed', async(() => {
    fixture.detectChanges()

    const editorElem = fixture.debugElement.children[0]

    fixture.componentInstance.isReadOnly = true
    fixture.detectChanges()

    fixture.whenStable().then(() => {
      expect(editorElem.nativeElement.querySelector('div[quill-editor-element]').style.height).toEqual('30px')
    })
  }))

  it('should set touched state correctly', async(() => {
    fixture.detectChanges()

    const editorFixture = fixture.debugElement.children[0]

    editorFixture.componentInstance.quillEditor.focus()
    editorFixture.componentInstance.quillEditor.blur()
    fixture.detectChanges()

    expect(editorFixture.nativeElement.className).toMatch('ng-touched')
  }))

  it('should set required state correctly', async(() => {
    // get editor component
    const editorElement = fixture.debugElement.children[0].nativeElement

    fixture.componentInstance.title = ''
    fixture.detectChanges()
    fixture.whenStable().then(() => {
      expect(editorElement.className).toMatch('ng-valid')
    })
  }))

  it('should emit onEditorCreated with editor instance', async( async () => {
    spyOn(fixture.componentInstance, 'handleEditorCreated')
    fixture.detectChanges()
    await fixture.whenStable()
    const editorComponent = fixture.debugElement.children[0].componentInstance
    expect(fixture.componentInstance.handleEditorCreated).toHaveBeenCalledWith(editorComponent.quillEditor)
  }))

  it('should emit onContentChanged when content of editor changed + editor changed', async(() => {
    spyOn(fixture.componentInstance, 'handleChange').and.callThrough()
    spyOn(fixture.componentInstance, 'handleEditorChange').and.callThrough()
    fixture.detectChanges()
    fixture.whenStable().then(() => {
      const editorFixture = fixture.debugElement.children[0]
      editorFixture.componentInstance.quillEditor.setText('1234', 'user')
      fixture.detectChanges()
      return fixture.whenStable()
    }).then(() => {
      expect(fixture.componentInstance.handleChange).toHaveBeenCalledWith(fixture.componentInstance.changed)
      expect(fixture.componentInstance.handleEditorChange).toHaveBeenCalledWith(fixture.componentInstance.changedEditor)
    })
  }))

  it('should emit onSelectionChanged when selection changed + editor changed', async(() => {
    spyOn(fixture.componentInstance, 'handleSelection').and.callThrough()
    spyOn(fixture.componentInstance, 'handleEditorChange').and.callThrough()
    fixture.detectChanges()

    const editorFixture = fixture.debugElement.children[0]

    editorFixture.componentInstance.quillEditor.focus()
    editorFixture.componentInstance.quillEditor.blur()
    fixture.detectChanges()
    expect(fixture.componentInstance.handleSelection).toHaveBeenCalledWith(fixture.componentInstance.selected)
    expect(fixture.componentInstance.handleEditorChange).toHaveBeenCalledWith(fixture.componentInstance.changedEditor)
  }))

  it('should emit onFocus when focused', async(() => {
    fixture.detectChanges()

    const editorFixture = fixture.debugElement.children[0]

    editorFixture.componentInstance.quillEditor.focus()
    fixture.detectChanges()

    expect(fixture.componentInstance.focused).toBe(true)
  }))

  it('should emit onBlur when blured', async(() => {
    fixture.detectChanges()

    const editorFixture = fixture.debugElement.children[0]

    editorFixture.componentInstance.quillEditor.focus()
    editorFixture.componentInstance.quillEditor.blur()
    fixture.detectChanges()

    expect(fixture.componentInstance.blured).toBe(true)
  }))

  it('should validate minlength', async(() => {
    // get editor component
    const editorComponent = fixture.debugElement.children[0].componentInstance
    const editorElement = fixture.debugElement.children[0].nativeElement

    fixture.detectChanges()
    fixture.whenStable().then(() => {
      expect(editorElement.className).toMatch('ng-valid')

      // set minlength
      fixture.componentInstance.minLength = 8
      fixture.componentInstance.title = 'Hallo1'

      fixture.detectChanges()

      return fixture.whenStable()
    }).then(() => {
      fixture.detectChanges()
      expect(editorComponent.minLength).toBe(8)
      expect(editorElement.className).toMatch('ng-invalid')
    })
  }))

  it('should set valid minlength if model is empty', async(() => {
    // get editor component
    const editorComponent = fixture.debugElement.children[0].componentInstance
    const editorElement = fixture.debugElement.children[0].nativeElement

    fixture.detectChanges()
    fixture.whenStable().then(() => {
      // set min length
      editorComponent.minLength = 2
      // change text
      editorComponent.quillEditor.setText('', 'user')

      fixture.detectChanges()
      return fixture.whenStable()
    }).then(() => {
      fixture.detectChanges()
      expect(editorElement.className).toMatch('ng-valid')
    })
  }))

  it('should validate maxlength', async(() => {
    // get editor component
    const editorComponent = fixture.debugElement.children[0].componentInstance
    const editorElement = fixture.debugElement.children[0].nativeElement

    fixture.detectChanges()
    fixture.whenStable().then(() => {
      expect(fixture.debugElement.children[0].nativeElement.className).toMatch('ng-valid')

      fixture.componentInstance.maxLength = 3
      fixture.componentInstance.title = '1234'
      fixture.detectChanges()

      return fixture.whenStable()
    }).then(() => {
      fixture.detectChanges()

      expect(editorComponent.maxLength).toBe(3)
      expect(editorElement.className).toMatch('ng-invalid')
    })
  }))

  it('should validate maxlength and minlength', async(() => {
    // get editor component
    const editorElement = fixture.debugElement.children[0].nativeElement

    fixture.detectChanges()
    fixture.whenStable().then(() => {
      expect(fixture.debugElement.children[0].nativeElement.className).toMatch('ng-valid')

      fixture.componentInstance.minLength = 3
      fixture.componentInstance.maxLength = 5
      fixture.componentInstance.title = '123456'

      fixture.detectChanges()
      return fixture.whenStable()
    }).then(() => {
      fixture.detectChanges()
      expect(editorElement.className).toMatch('ng-invalid')

      fixture.componentInstance.title = '1234'

      fixture.detectChanges()
      return fixture.whenStable()
    }).then(() => {
      fixture.detectChanges()
      expect(editorElement.className).toMatch('ng-valid')
    })
  }))

  it('should validate required', async(() => {
    // get editor component
    const editorElement = fixture.debugElement.children[0].nativeElement
    const editorComponent = fixture.debugElement.children[0].componentInstance

    fixture.detectChanges()
    fixture.whenStable().then(() => {
      expect(fixture.debugElement.children[0].nativeElement.className).toMatch('ng-valid')
      expect(editorComponent.required).toBeFalsy()

      fixture.componentInstance.required = true
      fixture.componentInstance.title = ''

      fixture.detectChanges()
      return fixture.whenStable()
    }).then(() => {
      fixture.detectChanges()

      expect(editorComponent.required).toBeTruthy()
      expect(editorElement.className).toMatch('ng-invalid')

      fixture.componentInstance.title = '1'

      fixture.detectChanges()
      return fixture.whenStable()
    }).then(() => {
      fixture.detectChanges()
      expect(editorElement.className).toMatch('ng-valid')
    })
  }))

  it('should add custom toolbar', async(() => {
    // get editor component
    const toolbarFixture = TestBed.createComponent(TestToolbarComponent) as ComponentFixture<TestToolbarComponent>

    toolbarFixture.detectChanges()
    expect(toolbarFixture.debugElement.children[0].nativeElement.children[1].attributes['quill-editor-element']).toBeDefined()
    expect(toolbarFixture.debugElement.children[0].nativeElement.children[0].attributes['quill-editor-toolbar']).toBeDefined()

    const editorComponent = toolbarFixture.debugElement.children[0].componentInstance
    expect(editorComponent.required).toBe(true)
    expect(editorComponent.customToolbarPosition).toEqual('top')
  }))

  it('should add custom toolbar at the end', async(() => {
    // get editor component
    const toolbarFixture = TestBed.createComponent(TestToolbarComponent) as ComponentFixture<TestToolbarComponent>
    toolbarFixture.componentInstance.toolbarPosition = 'bottom'
    toolbarFixture.detectChanges()

    expect(toolbarFixture.debugElement.children[0].nativeElement.children[0].attributes['quill-editor-element']).toBeDefined()
    expect(toolbarFixture.debugElement.children[0].nativeElement.children[1].attributes['quill-editor-toolbar']).toBeDefined()

    const editorComponent = toolbarFixture.debugElement.children[0].componentInstance
    expect(editorComponent.customToolbarPosition).toEqual('bottom')
  }))
})

describe('QuillEditor - base config', () => {
  let fixture: ComponentFixture<TestComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, TestToolbarComponent],
      imports: [FormsModule, QuillModule],
      providers: QuillModule.forRoot({
        bounds: 'body',
        debug: false,
        format: 'object',
        formats: ['bold'],
        modules: {
          toolbar: [
            ['bold']
          ]
        },
        placeholder: 'placeholder',
        readOnly: true,
        scrollingContainer: null,
        theme: 'snow',
        trackChanges: 'all'
      }).providers
    }).compileComponents()
  })

  it('renders editor with config', async( async () => {
    fixture = TestBed.createComponent(TestComponent)
    fixture.detectChanges()
    await fixture.whenStable()

    const editor = fixture.componentInstance.editor as QuillNamespace.Quill

    expect(fixture.nativeElement.querySelector('.ql-toolbar').querySelectorAll('button').length).toBe(1)
    expect(fixture.nativeElement.querySelector('.ql-toolbar').querySelector('button.ql-bold')).toBeDefined()

    editor.updateContents([{
      insert: 'content',
      attributes: {
        bold: true,
        italic: true
      }
    }] as any, 'api')
    fixture.detectChanges()

    expect(JSON.stringify(fixture.componentInstance.title)).toEqual(JSON.stringify({ ops: [{ attributes: { bold: true }, insert: `content`}, {'insert':'\n'}] }))
    expect(editor.root.dataset.placeholder).toEqual('placeholder')
  }))
})

describe('QuillEditor - preserveWhitespace', () => {
  let fixture: ComponentFixture<PreserveWhitespaceTestComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreserveWhitespaceTestComponent],
      imports: [FormsModule, QuillModule],
      providers: QuillModule.forRoot().providers
    }).compileComponents()
  })

  it('renders editor with config', async(async () => {
    fixture = TestBed.createComponent(PreserveWhitespaceTestComponent)
    fixture.detectChanges()
    const editor = fixture.componentInstance.editor

    expect(editor.editorElem!.tagName).toEqual('PRE')
  }))
})
