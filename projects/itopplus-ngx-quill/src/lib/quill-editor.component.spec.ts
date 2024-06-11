/* eslint-disable @typescript-eslint/no-explicit-any */
import {Component, Renderer2, ViewChild} from '@angular/core'
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing'
import {defer} from 'rxjs'

import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms'

import {QuillEditorComponent} from './quill-editor.component'

import Quill from 'quill'
import {QuillModule} from './quill.module'

window.setTimeout = ((cb) => {
  cb()
  return 0
}) as any

// eslint-disable-next-line @typescript-eslint/no-var-requires
const QuillNamespace = require('quill')

class CustomModule {
  quill: Quill
  options: any

  constructor(quill: Quill, options: any) {
    this.quill = quill
    this.options = options
  }
}

@Component({
  template: `
<quill-editor
  (onBlur)="blured = true"
  (onFocus)="focused = true"
  (onNativeBlur)="bluredNative = true"
  (onNativeFocus)="focusedNative = true"
  [(ngModel)]="title"
  [customOptions]="[{import: 'attributors/style/size', whitelist: ['14']}]"
  [styles]="style"
  [required]="required"
  [minLength]="minLength"
  [maxLength]="maxLength"
  [readOnly]="isReadOnly"
  [debounceTime]="debounceTime"
  (onEditorCreated)="handleEditorCreated($event)"
  (onEditorChanged)="handleEditorChange($event)"
  (onContentChanged)="handleChange($event)"
  (onSelectionChanged)="handleSelection($event)"
></quill-editor>
`
})
class TestComponent {
  @ViewChild(QuillEditorComponent, { static: true }) editorComponent!: QuillEditorComponent
  title: any = 'Hallo'
  isReadOnly = false
  required = false
  minLength = 0
  focused = false
  blured = false
  focusedNative = false
  bluredNative = false
  maxLength = 0
  style: {
    backgroundColor?: string
    color?: string
    height?: string
  } | null = { height: '30px' }
  editor: any
  debounceTime: number

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
<quill-editor
  [customToolbarPosition]="toolbarPosition"
  [(ngModel)]="title" [required]="true"
  [minLength]="minLength"
  [maxLength]="maxLength"
  [readOnly]="isReadOnly"
  (onEditorCreated)="handleEditorCreated($event)"
  (onContentChanged)="handleChange($event)"
>
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
  <div above-quill-editor-toolbar="true">
    <span>above</span>
  </div>
  <div below-quill-editor-toolbar="true">
    <span>below</span>
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

  handleEditorCreated() {return}
  handleChange() {return}
}

@Component({
  template: `
    <quill-editor [formControl]='formControl' [minLength]='minLength'></quill-editor>
`
})
class ReactiveFormTestComponent {
  @ViewChild(QuillEditorComponent, { static: true }) editor!: QuillEditorComponent
  formControl: FormControl = new FormControl('a')
  minLength = 3
}

@Component({
  template: `
    <quill-editor [ngModel]="content" [preserveWhitespace]="true"></quill-editor>
`
})
class PreserveWhitespaceTestComponent {
  @ViewChild(QuillEditorComponent, { static: true }) editor!: QuillEditorComponent
  content = '<p>test     test   </p>'
}

@Component({
  template: `
    <quill-editor [modules]="{custom: true}" [customModules]="[{path: 'modules/custom', implementation: impl}]"></quill-editor>
`
})
class CustomModuleTestComponent {
  @ViewChild(QuillEditorComponent, { static: true }) editor!: QuillEditorComponent
  impl = CustomModule
}

@Component({
  template: `
    <quill-editor [modules]="{custom: true}" [customModules]="customModules"></quill-editor>
`
})
class CustomAsynchronousModuleTestComponent {
  @ViewChild(QuillEditorComponent, { static: true }) editor!: QuillEditorComponent
  customModules = [
    {
      path: 'modules/custom',
      implementation: defer(() => Promise.resolve(CustomModule))
    }
  ]
}

@Component({
  template: `
    <quill-editor [ngModel]="content" [linkPlaceholder]="'https://test.de'"></quill-editor>
`
})
class CustomLinkPlaceholderTestComponent {
  @ViewChild(QuillEditorComponent, { static: true }) editor!: QuillEditorComponent
  content = ''
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

  it('ngOnDestroy - removes listeners', async () => {
    fixture.detectChanges()
    await fixture.whenStable()
    const spy = spyOn(fixture.componentInstance.quillEditor, 'off').and.callThrough()

    fixture.componentInstance.ngOnDestroy()

    expect(spy).toHaveBeenCalledTimes(3)
    const quillEditor: any = fixture.componentInstance.quillEditor
    /* eslint-disable no-underscore-dangle */
    expect(quillEditor.emitter._events['editor-change']).toHaveSize(5)
    expect(quillEditor.emitter._events['selection-change']).toBeInstanceOf(Object)
    expect(quillEditor.emitter._events['text-change']).toBeFalsy()
    /* eslint-enable no-underscore-dangle */
  })

  it('should render toolbar', async () => {
    const element = fixture.nativeElement
    fixture.detectChanges()
    await fixture.whenStable()
    await fixture.whenStable()

    expect(element.querySelectorAll('div.ql-toolbar.ql-snow').length).toBe(1)
    expect(fixture.componentInstance.quillEditor).toBeDefined()
  })

  it('should render text div', async () => {
    const element = fixture.nativeElement
    fixture.detectChanges()
    await fixture.whenStable()
    await fixture.whenStable()

    expect(element.querySelectorAll('div.ql-container.ql-snow').length).toBe(1)
    expect(fixture.componentInstance.quillEditor).toBeDefined()
  })
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

    beforeEach(async () => {
      TestBed.configureTestingModule({
        declarations: [ObjectComponent],
        imports: [FormsModule, QuillModule],
        providers: QuillModule.forRoot().providers
      })

      fixture = TestBed.createComponent(ObjectComponent) as ComponentFixture<ObjectComponent>
      fixture.detectChanges()
      await fixture.whenStable()
    })
    it('should be set object', async () => {
      const component = fixture.componentInstance

      await fixture.whenStable()
      await fixture.whenStable()
      expect(JSON.stringify(component.editor.getContents())).toEqual(JSON.stringify({ops: [{insert: 'Hello\n'}]}))
    })

    it('should update text', async () => {
      const component = fixture.componentInstance
      await fixture.whenStable()
      component.title = [{ insert: '1234' }]
      fixture.detectChanges()

      await fixture.whenStable()
      expect(JSON.stringify(component.editor.getContents())).toEqual(JSON.stringify({ops: [{insert: '1234\n'}]}))
    })

    it('should update model if editor text changes', async () => {
      const component = fixture.componentInstance

      await fixture.whenStable()
      component.editor.setContents([{ insert: '123' }], 'user')
      fixture.detectChanges()

      await fixture.whenStable()
      expect(JSON.stringify(component.title)).toEqual(JSON.stringify({ops: [{insert: '123\n'}]}))
    })
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
    let component: HTMLComponent

    beforeEach(async () => {
      TestBed.configureTestingModule({
        declarations: [HTMLComponent, HTMLSanitizeComponent],
        imports: [FormsModule, QuillModule.forRoot()]
      })

      fixture = TestBed.createComponent(HTMLComponent) as ComponentFixture<HTMLComponent>
      component = fixture.componentInstance
      fixture.detectChanges()
      await fixture.whenStable()
    })
    it('should be set html', async () => {
      expect(component.editor.getText().trim()).toEqual('Hallo')
    })

    it('should update html', async () => {
      component.title = '<p>test</p>'
      fixture.detectChanges()
      await fixture.whenStable()
      expect(component.editor.getText().trim()).toEqual('test')
    })

    it('should update model if editor html changes', async () => {
      expect(component.title.trim()).toEqual('<p>Hallo</p>')
      component.editor.setText('1234', 'user')
      fixture.detectChanges()
      await fixture.whenStable()
      expect(component.title.trim()).toEqual('<p>1234</p>')
    })

    it('should sanitize html', async () => {
      const sanfixture = TestBed.createComponent(HTMLSanitizeComponent) as ComponentFixture<HTMLSanitizeComponent>
      sanfixture.detectChanges()

      await sanfixture.whenStable()
      const incomponent = sanfixture.componentInstance

      expect(JSON.stringify(incomponent.editor.getContents()))
      .toEqual(JSON.stringify({ops: [{insert: 'Hallo ' }, {insert: {image: 'wroooong.jpg'}}, {insert: '\n'}]}))

      incomponent.title = '<p><img src="xxxx" onerror="window.alert()"></p>'
      sanfixture.detectChanges()

      await sanfixture.whenStable()
      expect(JSON.stringify(incomponent.editor.getContents())).toEqual(JSON.stringify({ops: [{insert: {image: 'xxxx'}}, {insert: '\n'}]}))
    })
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
    it('should be set text', async () => {
      const component = fixture.componentInstance
      await fixture.whenStable()
      expect(component.editor.getText().trim()).toEqual('Hallo')
    })

    it('should update text', async () => {
      const component = fixture.componentInstance
      component.title = 'test'
      fixture.detectChanges()

      await fixture.whenStable()
      expect(component.editor.getText().trim()).toEqual('test')
    })

    it('should update model if editor text changes', async () => {
      const component = fixture.componentInstance
      await fixture.whenStable()
      component.editor.setText('123', 'user')
      fixture.detectChanges()
      await fixture.whenStable()
      expect(component.title.trim()).toEqual('123')
    })

    it('should not update model if editor content changed by api', async () => {
      const component = fixture.componentInstance
      await fixture.whenStable()
      component.editor.setText('123')
      fixture.detectChanges()
      await fixture.whenStable()
      expect(component.title.trim()).toEqual('Hallo')
    })
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
    let component: JSONComponent

    beforeEach(async () => {
      TestBed.configureTestingModule({
        declarations: [JSONComponent, JSONInvalidComponent],
        imports: [FormsModule, QuillModule.forRoot()]
      })

      fixture = TestBed.createComponent(JSONComponent) as ComponentFixture<JSONComponent>
      component = fixture.componentInstance
      fixture.detectChanges()
      await fixture.whenStable()
    })

    it('should set json string', async () => {
      expect(JSON.stringify(component.editor.getContents())).toEqual(JSON.stringify({ops: [{insert: 'Hallo\n'}]}))
    })

    it('should update json string', async () => {
      component.title = JSON.stringify([{
        insert: 'Hallo 123'
      }])
      fixture.detectChanges()
      await fixture.whenStable()
      expect(JSON.stringify(component.editor.getContents())).toEqual(JSON.stringify({ops: [{insert: 'Hallo 123\n'}]}))
    })

    it('should update model if editor changes', async () => {
      component.editor.setContents([{
        insert: 'Hallo 123'
      }], 'user')
      fixture.detectChanges()
      await fixture.whenStable()

      expect(component.title).toEqual(JSON.stringify({ops: [{insert: 'Hallo 123\n'}]}))
    })

    it('should set as text if invalid JSON', async () => {
      const infixture = TestBed.createComponent(JSONInvalidComponent) as ComponentFixture<JSONInvalidComponent>
      infixture.detectChanges()
      await infixture.whenStable()
      const incomponent = infixture.componentInstance
      expect(incomponent.editor.getText().trim()).toEqual(JSON.stringify([{
        insert: 'Hallo'
      }]) + '{')

      incomponent.title = JSON.stringify([{
        insert: 'Hallo 1234'
      }]) + '{'
      infixture.detectChanges()
      await infixture.whenStable()
      expect(incomponent.editor.getText().trim()).toEqual(JSON.stringify([{
        insert: 'Hallo 1234'
      }]) + '{')
    })
  })
})

describe('Dynamic styles', () => {
  @Component({
    template: `
  <quill-editor
    [bounds]="'self'"
    [(ngModel)]="title"
    format="text"
    [styles]="style"
    (onEditorCreated)="handleEditorCreated($event)"></quill-editor>
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

  it('set inital styles', async () => {
    const component = fixture.componentInstance
    await fixture.whenStable()
    expect(component.editor.container.style.backgroundColor).toEqual('red')
  })

  it('set style', async () => {
    const component = fixture.componentInstance
    await fixture.whenStable()
    component.style = {
      backgroundColor: 'gray'
    }
    fixture.detectChanges()
    await fixture.whenStable()
    expect(component.editor.container.style.backgroundColor).toEqual('gray')
  })
})

describe('Dynamic classes', () => {
  @Component({
    template: `
  <quill-editor
    [bounds]="'self'"
    [(ngModel)]="title"
    format="text"
    [classes]="classes"
    (onEditorCreated)="handleEditorCreated($event)"></quill-editor>
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

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ClassesComponent],
      imports: [FormsModule, QuillModule.forRoot()]
    })

    fixture = TestBed.createComponent(ClassesComponent) as ComponentFixture<ClassesComponent>
    fixture.detectChanges()
    await fixture.whenStable()
  })

  it('should set initial classes', async () => {
    const component = fixture.componentInstance
    expect(component.editor.container.classList.contains('test-class1')).toBe(true)
    expect(component.editor.container.classList.contains('test-class2')).toBe(true)
  })

  it('should set class', async () => {
    const component = fixture.componentInstance

    component.classes = 'test-class2 test-class3'
    fixture.detectChanges()
    await fixture.whenStable()

    expect(component.editor.container.classList.contains('test-class1')).toBe(false)
    expect(component.editor.container.classList.contains('test-class2')).toBe(true)
    expect(component.editor.container.classList.contains('test-class3')).toBe(true)
  })
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

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ReactiveFormTestComponent],
      imports: [FormsModule, ReactiveFormsModule, QuillModule],
      providers: QuillModule.forRoot().providers
    })

    fixture = TestBed.createComponent(ReactiveFormTestComponent) as ComponentFixture<ReactiveFormTestComponent>
    fixture.detectChanges()
    await fixture.whenStable()
  })

  it('should be disabled', () => {
    const component = fixture.componentInstance
    component.formControl.disable()
    expect((component.editor.quillEditor as any).container.classList.contains('ql-disabled')).toBeTruthy()
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

    expect((component.editor.quillEditor as any).container.classList.contains('ql-disabled')).toBeFalsy()
    expect(fixture.nativeElement.children[0].attributes.disabled).not.toBeDefined()
  })

  it('should leave form pristine when content of editor changed programmatically', async () => {
    const values: Array<string | null> = []

    fixture.detectChanges()
    await fixture.whenStable()

    fixture.componentInstance.formControl.valueChanges.subscribe((value: string) => values.push(value))
    fixture.componentInstance.formControl.patchValue('1234')

    fixture.detectChanges()
    await fixture.whenStable()

    expect(fixture.nativeElement.querySelector('div.ql-editor').textContent).toEqual('1234')
    expect(fixture.componentInstance.formControl.value).toEqual('1234')
    expect(fixture.componentInstance.formControl.pristine).toBeTruthy()
    expect(values).toEqual(['1234'])
  })

  it('should mark form dirty when content of editor changed by user', async () => {
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.componentInstance.editor.quillEditor.setText('1234', 'user')
    fixture.detectChanges()
    await fixture.whenStable()
    expect(fixture.nativeElement.querySelector('div.ql-editor').textContent).toEqual('1234')
    expect(fixture.componentInstance.formControl.dirty).toBeTruthy()
    expect(fixture.componentInstance.formControl.value).toEqual('<p>1234</p>')
  })

  it('should validate initial content and do not mark it as invalid', async () => {
    fixture.detectChanges()
    await fixture.whenStable()

    expect(fixture.nativeElement.querySelector('div.ql-editor').textContent).toEqual('a')
    expect(fixture.componentInstance.formControl.pristine).toBeTruthy()
    expect(fixture.componentInstance.formControl.value).toEqual('a')
    expect(fixture.componentInstance.formControl.invalid).toBeTruthy()
  })
})

describe('Advanced QuillEditorComponent', () => {
  let fixture: ComponentFixture<TestComponent>

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, TestToolbarComponent, CustomLinkPlaceholderTestComponent],
      imports: [FormsModule, QuillModule],
      providers: QuillModule.forRoot().providers
    }).compileComponents()

    fixture = TestBed.createComponent(TestComponent) as ComponentFixture<TestComponent>

    spyOn(QuillNamespace, 'import').and.callThrough()
    spyOn(QuillNamespace, 'register').and.callThrough()
  })

  it('should set editor settings', async () => {
    const editorElem = fixture.debugElement.children[0]
    const editorCmp = fixture.debugElement.children[0].componentInstance

    fixture.detectChanges()
    await fixture.whenStable()

    expect(editorCmp.readOnly).toBe(false)

    fixture.componentInstance.isReadOnly = true

    expect(QuillNamespace.import).toHaveBeenCalledWith('attributors/style/size')
    expect(QuillNamespace.register).toHaveBeenCalled()

    fixture.detectChanges()
    await fixture.whenStable()

    expect(editorCmp.readOnly).toBe(true)
    expect(editorElem.nativeElement.querySelectorAll('div.ql-container.ql-disabled').length).toBe(1)
    expect(editorElem.nativeElement.querySelector('div[quill-editor-element]').style.height).toBe('30px')
  })

  it('should update editor style', async () => {
    fixture.detectChanges()
    await fixture.whenStable()
    const editorElem = fixture.debugElement.children[0]

    fixture.componentInstance.style = { backgroundColor: 'red' }
    fixture.detectChanges()
    await fixture.whenStable()

    expect(editorElem.nativeElement.querySelector('div[quill-editor-element]').style.backgroundColor).toBe('red')
    expect(editorElem.nativeElement.querySelector('div[quill-editor-element]').style.height).toEqual('')
  })

  it('should update editor style to null and readd styling', async () => {
    fixture.detectChanges()
    await fixture.whenStable()
    const editorElem = fixture.debugElement.children[0]

    fixture.componentInstance.style = null
    fixture.detectChanges()
    await fixture.whenStable()

    fixture.componentInstance.style = { color: 'red' }
    expect(editorElem.nativeElement.querySelector('div[quill-editor-element]').style.height).toEqual('')

    fixture.detectChanges()
    await fixture.whenStable()

    expect(editorElem.nativeElement.querySelector('div[quill-editor-element]').style.color).toBe('red')
  })

  it('should not update editor style if nothing changed', async () => {
    fixture.detectChanges()
    await fixture.whenStable()
    const editorElem = fixture.debugElement.children[0]

    fixture.componentInstance.isReadOnly = true
    fixture.detectChanges()

    await fixture.whenStable
    expect(editorElem.nativeElement.querySelector('div[quill-editor-element]').style.height).toEqual('30px')
  })

  it('should set touched state correctly', async () => {
    fixture.detectChanges()
    await fixture.whenStable()
    const editorFixture = fixture.debugElement.children[0]

    editorFixture.componentInstance.quillEditor.setSelection(0, 5)
    fixture.detectChanges()
    await fixture.whenStable()
    editorFixture.componentInstance.quillEditor.setSelection(null)
    fixture.detectChanges()
    await fixture.whenStable()

    expect(editorFixture.nativeElement.className).toMatch('ng-untouched')

    editorFixture.componentInstance.quillEditor.setSelection(0, 5, 'user')
    fixture.detectChanges()
    await fixture.whenStable()
    editorFixture.componentInstance.quillEditor.setSelection(null, 'user')
    fixture.detectChanges()
    await fixture.whenStable()

    expect(editorFixture.nativeElement.className).toMatch('ng-touched')
  })

  it('should set required state correctly', async () => {
    fixture.detectChanges()
    await fixture.whenStable()

    // get editor component
    const editorElement = fixture.debugElement.children[0].nativeElement

    fixture.componentInstance.title = ''
    fixture.detectChanges()
    await fixture.whenStable()
    expect(editorElement.className).toMatch('ng-valid')
  })

  it('should emit onEditorCreated with editor instance',  async () => {
    fixture.componentInstance.editorComponent.onValidatorChanged = () => { return }

    spyOn(fixture.componentInstance, 'handleEditorCreated')

    fixture.detectChanges()
    spyOn(fixture.componentInstance.editorComponent, 'onValidatorChanged')

    await fixture.whenStable()

    const editorComponent = fixture.debugElement.children[0].componentInstance
    expect(fixture.componentInstance.handleEditorCreated).toHaveBeenCalledWith(editorComponent.quillEditor)
    expect(fixture.componentInstance.editorComponent.onValidatorChanged).toHaveBeenCalled()
  })

  it('should emit onContentChanged when content of editor changed + editor changed', async () => {
    spyOn(fixture.componentInstance, 'handleChange').and.callThrough()
    spyOn(fixture.componentInstance, 'handleEditorChange').and.callThrough()

    fixture.detectChanges()
    await fixture.whenStable()

    const editorFixture = fixture.debugElement.children[0]
    editorFixture.componentInstance.quillEditor.setText('1234', 'user')
    fixture.detectChanges()
    await fixture.whenStable()

    expect(fixture.componentInstance.handleChange).toHaveBeenCalledWith(fixture.componentInstance.changed)
    expect(fixture.componentInstance.handleEditorChange).toHaveBeenCalledWith(fixture.componentInstance.changedEditor)
  })

  it('should emit onContentChanged with a delay after content of editor changed + editor changed', fakeAsync(() => {
    fixture.componentInstance.debounceTime = 400
    spyOn(fixture.componentInstance, 'handleChange').and.callThrough()
    spyOn(fixture.componentInstance, 'handleEditorChange').and.callThrough()

    fixture.detectChanges()
    tick()

    const editorFixture = fixture.debugElement.children[0]
    editorFixture.componentInstance.quillEditor.setText('foo', 'bar')
    fixture.detectChanges()
    tick()

    expect(fixture.componentInstance.handleChange).not.toHaveBeenCalled()
    expect(fixture.componentInstance.handleEditorChange).not.toHaveBeenCalled()

    tick(400)

    expect(fixture.componentInstance.handleChange).toHaveBeenCalledWith(fixture.componentInstance.changed)
    expect(fixture.componentInstance.handleEditorChange).toHaveBeenCalledWith(fixture.componentInstance.changedEditor)
  }))

  it('should emit onContentChanged once after editor content changed twice within debounce interval + editor changed',
    fakeAsync(() => {
      fixture.componentInstance.debounceTime = 400
      spyOn(fixture.componentInstance, 'handleChange').and.callThrough()
      spyOn(fixture.componentInstance, 'handleEditorChange').and.callThrough()

      fixture.detectChanges()
      tick()

      const editorFixture = fixture.debugElement.children[0]
      editorFixture.componentInstance.quillEditor.setText('foo', 'bar')
      fixture.detectChanges()
      tick(200)

      editorFixture.componentInstance.quillEditor.setText('baz', 'bar')
      fixture.detectChanges()
      tick(400)

      expect(fixture.componentInstance.handleChange).toHaveBeenCalledTimes(1)
      expect(fixture.componentInstance.handleChange).toHaveBeenCalledWith(fixture.componentInstance.changed)
      expect(fixture.componentInstance.handleEditorChange).toHaveBeenCalledTimes(1)
      expect(fixture.componentInstance.handleEditorChange).toHaveBeenCalledWith(fixture.componentInstance.changedEditor)
    })
  )

  it(`should adjust the debounce time if the value of 'debounceTime' changes`, fakeAsync(() => {
    fixture.componentInstance.debounceTime = 400
    const handleChangeSpy = spyOn(fixture.componentInstance, 'handleChange').and.callThrough()
    const handleEditorChangeSpy = spyOn(fixture.componentInstance, 'handleEditorChange').and.callThrough()

    fixture.detectChanges()
    tick()

    const editorFixture = fixture.debugElement.children[0]
    editorFixture.componentInstance.quillEditor.setText('foo', 'bar')
    fixture.detectChanges()
    tick()

    expect(fixture.componentInstance.handleChange).not.toHaveBeenCalled()
    expect(fixture.componentInstance.handleEditorChange).not.toHaveBeenCalled()

    tick(400)

    expect(fixture.componentInstance.handleChange).toHaveBeenCalledWith(fixture.componentInstance.changed)
    expect(fixture.componentInstance.handleEditorChange).toHaveBeenCalledWith(fixture.componentInstance.changedEditor)
    handleChangeSpy.calls.reset()
    handleEditorChangeSpy.calls.reset()

    fixture.componentInstance.debounceTime = 200
    fixture.detectChanges()
    tick()

    editorFixture.componentInstance.quillEditor.setText('baz', 'foo')
    fixture.detectChanges()
    tick()

    expect(fixture.componentInstance.handleChange).not.toHaveBeenCalled()
    expect(fixture.componentInstance.handleEditorChange).not.toHaveBeenCalled()

    tick(200)

    expect(fixture.componentInstance.handleChange).toHaveBeenCalledWith(fixture.componentInstance.changed)
    expect(fixture.componentInstance.handleEditorChange).toHaveBeenCalledWith(fixture.componentInstance.changedEditor)
  }))

  it('should unsubscribe from Quill events on destroy', async () => {
    fixture.componentInstance.debounceTime = 400
    fixture.detectChanges()
    await fixture.whenStable()

    const editorFixture = fixture.debugElement.children[0]
    const quillOffSpy = spyOn(editorFixture.componentInstance.quillEditor, 'off').and.callThrough()
    editorFixture.componentInstance.quillEditor.setText('baz', 'bar')
    fixture.detectChanges()
    await fixture.whenStable()

    fixture.destroy()

    expect(quillOffSpy).toHaveBeenCalledTimes(3)
    expect(editorFixture.componentInstance.subscription).toEqual(null)
    expect(quillOffSpy).toHaveBeenCalledWith('text-change', jasmine.any(Function))
    expect(quillOffSpy).toHaveBeenCalledWith('editor-change', jasmine.any(Function))
    expect(quillOffSpy).toHaveBeenCalledWith('selection-change', jasmine.any(Function))
  })

  it('should emit onSelectionChanged when selection changed + editor changed', async () => {
    spyOn(fixture.componentInstance, 'handleSelection').and.callThrough()
    spyOn(fixture.componentInstance, 'handleEditorChange').and.callThrough()

    fixture.detectChanges()
    await fixture.whenStable()

    const editorFixture = fixture.debugElement.children[0]

    editorFixture.componentInstance.quillEditor.focus()
    editorFixture.componentInstance.quillEditor.blur()
    fixture.detectChanges()

    expect(fixture.componentInstance.handleSelection).toHaveBeenCalledWith(fixture.componentInstance.selected)
    expect(fixture.componentInstance.handleEditorChange).toHaveBeenCalledWith(fixture.componentInstance.changedEditor)
  })

  it('should emit onFocus when focused', async () => {
    fixture.detectChanges()
    await fixture.whenStable()

    const editorFixture = fixture.debugElement.children[0]

    editorFixture.componentInstance.quillEditor.focus()
    fixture.detectChanges()

    expect(fixture.componentInstance.focused).toBe(true)
  })

  it('should emit onNativeFocus when scroll container receives focus', async () => {
    fixture.detectChanges()
    await fixture.whenStable()

    const editorFixture = fixture.debugElement.children[0]

    editorFixture.componentInstance.quillEditor.scroll.domNode.focus()
    fixture.detectChanges()

    expect(fixture.componentInstance.focusedNative).toBe(true)
  })

  it('should emit onBlur when blured', async () => {
    fixture.detectChanges()
    await fixture.whenStable()

    const editorFixture = fixture.debugElement.children[0]

    editorFixture.componentInstance.quillEditor.focus()
    editorFixture.componentInstance.quillEditor.blur()
    fixture.detectChanges()

    expect(fixture.componentInstance.blured).toBe(true)
  })

  it('should emit onNativeBlur when scroll container receives blur', async () => {
    fixture.detectChanges()
    await fixture.whenStable()

    const editorFixture = fixture.debugElement.children[0]

    editorFixture.componentInstance.quillEditor.scroll.domNode.focus()
    editorFixture.componentInstance.quillEditor.scroll.domNode.blur()
    fixture.detectChanges()

    expect(fixture.componentInstance.bluredNative).toBe(true)
  })

  it('should validate minlength', async () => {
    fixture.detectChanges()
    await fixture.whenStable()

    // get editor component
    const editorComponent = fixture.debugElement.children[0].componentInstance
    const editorElement = fixture.debugElement.children[0].nativeElement

    expect(editorElement.className).toMatch('ng-valid')

    // set minlength
    fixture.componentInstance.minLength = 8
    fixture.detectChanges()
    await fixture.whenStable()
    expect(editorComponent.minLength).toBe(8)

    fixture.componentInstance.title = 'Hallo1'
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()
    await fixture.whenStable()
    expect(editorElement.className).toMatch('ng-invalid')
  })

  it('should set valid minlength if model is empty', async () => {

    fixture.detectChanges()
    await fixture.whenStable()

    // get editor component
    const editorComponent = fixture.debugElement.children[0].componentInstance
    const editorElement = fixture.debugElement.children[0].nativeElement

    // set min length
    editorComponent.minLength = 2
    // change text
    editorComponent.quillEditor.setText('', 'user')

    fixture.detectChanges()
    await fixture.whenStable()

    fixture.detectChanges()
    expect(editorElement.className).toMatch('ng-valid')
  })

  it('should validate maxlength', async () => {
    fixture.detectChanges()
    await fixture.whenStable()

    // get editor component
    const editorComponent = fixture.debugElement.children[0].componentInstance
    const editorElement = fixture.debugElement.children[0].nativeElement

    expect(fixture.debugElement.children[0].nativeElement.className).toMatch('ng-valid')

    fixture.componentInstance.maxLength = 3
    fixture.componentInstance.title = '1234'
    fixture.detectChanges()

    await fixture.whenStable()
    fixture.detectChanges()

    expect(editorComponent.maxLength).toBe(3)
    expect(editorElement.className).toMatch('ng-invalid')
  })

  it('should validate maxlength and minlength', async () => {
    fixture.detectChanges()
    await fixture.whenStable()

    // get editor component
    const editorElement = fixture.debugElement.children[0].nativeElement

    expect(fixture.debugElement.children[0].nativeElement.className).toMatch('ng-valid')

    fixture.componentInstance.minLength = 3
    fixture.componentInstance.maxLength = 5
    fixture.componentInstance.title = '123456'

    fixture.detectChanges()
    await fixture.whenStable()

    fixture.detectChanges()
    expect(editorElement.className).toMatch('ng-invalid')

    fixture.componentInstance.title = '1234'

    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()
    expect(editorElement.className).toMatch('ng-valid')
  })

  it('should validate maxlength and minlength with trimming white spaces', async () => {
    // get editor component
    const editorElement = fixture.debugElement.children[0].nativeElement
    fixture.componentInstance.editorComponent.trimOnValidation = true

    fixture.detectChanges()
    await fixture.whenStable()

    expect(fixture.debugElement.children[0].nativeElement.className).toMatch('ng-valid')

    fixture.componentInstance.minLength = 3
    fixture.componentInstance.maxLength = 5
    fixture.componentInstance.title = '  1234567  '

    fixture.detectChanges()
    await fixture.whenStable()

    fixture.detectChanges()
    expect(editorElement.className).toMatch('ng-invalid')

    fixture.componentInstance.title = '  1234  '

    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()

    expect(editorElement.className).toMatch('ng-valid')
  })

  it('should validate required', async () => {
    // get editor component
    const editorElement = fixture.debugElement.children[0].nativeElement
    const editorComponent = fixture.debugElement.children[0].componentInstance

    fixture.detectChanges()
    await fixture.whenStable()

    expect(fixture.debugElement.children[0].nativeElement.className).toMatch('ng-valid')
    expect(editorComponent.required).toBeFalsy()

    fixture.componentInstance.required = true
    fixture.componentInstance.title = ''

    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()

    expect(editorComponent.required).toBeTruthy()
    expect(editorElement.className).toMatch('ng-invalid')

    fixture.componentInstance.title = '1'

    fixture.detectChanges()
    await fixture.whenStable()

    fixture.detectChanges()
    expect(editorElement.className).toMatch('ng-valid')

    fixture.componentInstance.title = '<img src="test.jpg">'
    fixture.detectChanges()
    await fixture.whenStable()

    fixture.detectChanges()
    expect(editorElement.className).toMatch('ng-valid')
  })

  it('should add custom toolbar', async () => {
    // get editor component
    const toolbarFixture = TestBed.createComponent(TestToolbarComponent) as ComponentFixture<TestToolbarComponent>

    toolbarFixture.detectChanges()
    await toolbarFixture.whenStable()

    expect(toolbarFixture.debugElement.children[0].nativeElement.children[0].attributes['above-quill-editor-toolbar']).toBeDefined()
    expect(toolbarFixture.debugElement.children[0].nativeElement.children[1].attributes['quill-editor-toolbar']).toBeDefined()
    expect(toolbarFixture.debugElement.children[0].nativeElement.children[2].attributes['below-quill-editor-toolbar']).toBeDefined()
    expect(toolbarFixture.debugElement.children[0].nativeElement.children[3].attributes['quill-editor-element']).toBeDefined()

    const editorComponent = toolbarFixture.debugElement.children[0].componentInstance
    expect(editorComponent.required).toBe(true)
    expect(editorComponent.customToolbarPosition).toEqual('top')
  })

  it('should add custom toolbar at the end', async () => {
    // get editor component
    const toolbarFixture = TestBed.createComponent(TestToolbarComponent) as ComponentFixture<TestToolbarComponent>
    toolbarFixture.componentInstance.toolbarPosition = 'bottom'

    toolbarFixture.detectChanges()
    await toolbarFixture.whenStable()

    expect(toolbarFixture.debugElement.children[0].nativeElement.children[0].attributes['quill-editor-element']).toBeDefined()
    expect(toolbarFixture.debugElement.children[0].nativeElement.children[1].attributes['above-quill-editor-toolbar']).toBeDefined()
    expect(toolbarFixture.debugElement.children[0].nativeElement.children[2].attributes['quill-editor-toolbar']).toBeDefined()
    expect(toolbarFixture.debugElement.children[0].nativeElement.children[3].attributes['below-quill-editor-toolbar']).toBeDefined()

    const editorComponent = toolbarFixture.debugElement.children[0].componentInstance
    expect(editorComponent.customToolbarPosition).toEqual('bottom')
  })

  it('should render custom link placeholder', async () => {
    const linkFixture = TestBed.createComponent(CustomLinkPlaceholderTestComponent) as ComponentFixture<CustomLinkPlaceholderTestComponent>

    linkFixture.detectChanges()
    await linkFixture.whenStable()

    const el = linkFixture.nativeElement.querySelector('input[data-link]')

    expect(el.dataset.link).toBe('https://test.de')
  })
})

describe('QuillEditor - base config', () => {
  let fixture: ComponentFixture<TestComponent>
  let registerSpy: jasmine.Spy
  let importSpy: jasmine.Spy

  beforeAll(() => {
    importSpy = spyOn(QuillNamespace, 'import').and.callThrough()
    registerSpy = spyOn(QuillNamespace, 'register').and.callThrough()
  })

  beforeEach(async () => {

    TestBed.configureTestingModule({
      declarations: [TestComponent, TestToolbarComponent],
      imports: [FormsModule, QuillModule],
      providers: QuillModule.forRoot({
        customModules: [{
          path: 'modules/custom',
          implementation: CustomModule
        }],
        customOptions: [{
          import: 'attributors/style/size',
          whitelist: ['14']
        }],
        suppressGlobalRegisterWarning: true,
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

    fixture = TestBed.createComponent(TestComponent)
    fixture.detectChanges()
    await fixture.whenStable()

    expect(registerSpy).toHaveBeenCalledWith('modules/custom', CustomModule, true)
    expect(importSpy).toHaveBeenCalledWith('attributors/style/size')
  })

  it('renders editor with config',  async () => {

    const editor = fixture.componentInstance.editor as Quill

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

    expect(JSON.stringify(fixture.componentInstance.title))
      .toEqual(JSON.stringify({ ops: [{ attributes: { bold: true }, insert: 'content'}, {insert: '\n'}] }))
    expect(editor.root.dataset.placeholder).toEqual('placeholder')
    expect(registerSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({attrName: 'size', keyName: 'font-size', scope: 5, whitelist: ['14']}), true, true
    )

    // eslint-disable-next-line @typescript-eslint/dot-notation
    expect(fixture.componentInstance.editorComponent.quillEditor['options'].modules.toolbar)
      .toEqual(jasmine.objectContaining({
        container: [
          ['bold']
        ]
      }))
  })
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

  it('renders editor with config', async () => {
    fixture = TestBed.createComponent(PreserveWhitespaceTestComponent)
    fixture.detectChanges()
    await fixture.whenStable()
    const editor = fixture.componentInstance.editor

    expect(editor.editorElem!.tagName).toEqual('PRE')
  })
})

describe('QuillEditor - customModules', () => {
  let fixture: ComponentFixture<CustomModuleTestComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomModuleTestComponent],
      imports: [FormsModule, QuillModule],
      providers: QuillModule.forRoot().providers
    }).compileComponents()
  })

  it('renders editor with config', async () => {
    const spy = spyOn(QuillNamespace, 'register').and.callThrough()
    fixture = TestBed.createComponent(CustomModuleTestComponent)
    fixture.detectChanges()
    await fixture.whenStable()

    expect(spy).toHaveBeenCalled()
    // eslint-disable-next-line @typescript-eslint/dot-notation
    expect(fixture.componentInstance.editor.quillEditor['options'].modules.custom).toBeDefined()
  })
})

describe('QuillEditor - customModules (asynchronous)', () => {
  let fixture: ComponentFixture<CustomAsynchronousModuleTestComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomAsynchronousModuleTestComponent],
      imports: [FormsModule, QuillModule],
      providers: QuillModule.forRoot().providers
    }).compileComponents()
  })

  it('renders editor with config', async () => {
    const spy = spyOn(QuillNamespace, 'register').and.callThrough()
    fixture = TestBed.createComponent(CustomAsynchronousModuleTestComponent)
    fixture.detectChanges()
    await fixture.whenStable()

    expect(spy).toHaveBeenCalled()
    // eslint-disable-next-line @typescript-eslint/dot-notation
    expect(fixture.componentInstance.editor.quillEditor['options'].modules.custom).toBeDefined()
  })
})

describe('QuillEditor - defaultEmptyValue', () => {
  @Component({
    template: `
      <quill-editor defaultEmptyValue=""></quill-editor>
  `
  })
  class DefaultEmptyValueTestComponent {
    @ViewChild(QuillEditorComponent, { static: true }) editor!: QuillEditorComponent
  }

  let fixture: ComponentFixture<DefaultEmptyValueTestComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DefaultEmptyValueTestComponent],
      imports: [QuillModule],
      providers: QuillModule.forRoot().providers
    }).compileComponents()
  })

  it('should change default empty value', async () => {
    fixture = TestBed.createComponent(DefaultEmptyValueTestComponent)
    fixture.detectChanges()
    await fixture.whenStable()

    // eslint-disable-next-line @typescript-eslint/dot-notation
    expect(fixture.componentInstance.editor.defaultEmptyValue).toBeDefined()
  })
})

describe('QuillEditor - beforeRender', () => {
  @Component({
    template: `
      <quill-editor [beforeRender]="beforeRender"></quill-editor>
  `
  })
  class BeforeRenderTestComponent {
    @ViewChild(QuillEditorComponent, { static: true }) editor!: QuillEditorComponent

    beforeRender?: () => Promise<void>
  }

  let fixture: ComponentFixture<BeforeRenderTestComponent>

  it('should call beforeRender provided on the config level', async () => {
    const config = { beforeRender: () => Promise.resolve() }

    TestBed.configureTestingModule({
      declarations: [BeforeRenderTestComponent],
      imports: [QuillModule.forRoot(config)],
    })

    spyOn(config, 'beforeRender')

    fixture = TestBed.createComponent(BeforeRenderTestComponent)
    fixture.detectChanges()
    await fixture.whenStable()

    expect(config.beforeRender).toHaveBeenCalled()
  })

  it('should call beforeRender provided on the component level and should not call beforeRender on the config level', async () => {
    const config = { beforeRender: () => Promise.resolve() }

    TestBed.configureTestingModule({
      declarations: [BeforeRenderTestComponent],
      imports: [QuillModule.forRoot(config)],
    })

    spyOn(config, 'beforeRender')

    fixture = TestBed.createComponent(BeforeRenderTestComponent)
    fixture.componentInstance.beforeRender = () => Promise.resolve()
    spyOn(fixture.componentInstance, 'beforeRender')
    fixture.detectChanges()
    await fixture.whenStable()

    expect(config.beforeRender).not.toHaveBeenCalled()
    expect(fixture.componentInstance.beforeRender).toHaveBeenCalled()
  })
})
