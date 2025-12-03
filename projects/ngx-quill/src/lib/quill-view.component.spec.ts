import { Component, inputBinding, signal, ViewChild, WritableSignal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { beforeEach, describe, expect, test } from 'vitest'

import { QuillViewComponent } from './quill-view.component'

import Quill from 'quill'
import { QuillModule } from './quill.module'

class CustomModule {
  quill: Quill
  options: any

  constructor(quill: Quill, options: any) {
    this.quill = quill
    this.options = options
  }
}

describe('Basic QuillViewComponent', () => {
  let fixture: ComponentFixture<QuillViewComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        QuillModule.forRoot({
          customModules: [{
            path: 'modules/custom',
            implementation: CustomModule
          }],
          customOptions: [{
            import: 'attributors/style/size',
            whitelist: ['14']
          }],
        })
      ],
      providers: QuillModule.forRoot().providers
    }).compileComponents()
  })

  beforeEach(async () => {
    fixture = TestBed.createComponent(QuillViewComponent)
    await fixture.whenStable()
    await vi.waitUntil(() => !!fixture.componentInstance.quillEditor)
  })

  test('should render and set default snow theme class', async () => {
    const element = fixture.nativeElement

    expect(element.querySelectorAll('.ql-editor').length).toBe(1)
    expect(fixture.componentInstance.quillEditor).toBeDefined()
    const viewElement = element.querySelector('.ql-container.ql-snow.ngx-quill-view > .ql-editor')
    expect(viewElement).toBeDefined()
  })
})

describe('Formats', () => {
  describe('object', () => {
    let fixture: ComponentFixture<QuillViewComponent>
    let content: WritableSignal<any>
    const modules = signal([{
      path: 'modules/test',
      implementation: CustomModule
    }])
    const format = signal('object')

    beforeEach(async () => {
      content = signal([{
        insert: 'Hello'
      }])
      fixture = TestBed.createComponent(QuillViewComponent, {
        bindings: [inputBinding('content', content), inputBinding('format', format), inputBinding('customModules', modules)]
      })
      await fixture.whenStable()
      await vi.waitUntil(() => !!fixture.componentInstance.quillEditor)
    })

    test('should be set object', () => {
      const component = fixture.componentInstance

      expect(JSON.stringify(component.quillEditor.getContents())).toEqual(JSON.stringify({ ops: [{ insert: 'Hello\n' }] }))
    })

    test('should update object content', async () => {
      const component = fixture.componentInstance
      content.set([{ insert: '1234' }])
      await fixture.whenStable()

      expect(JSON.stringify(component.quillEditor.getContents())).toEqual(JSON.stringify({ ops: [{ insert: '1234\n' }] }))
    })
  })

  describe('html', () => {
    let fixture: ComponentFixture<QuillViewComponent>
    let content: WritableSignal<any>
    const format = signal('html')

    beforeEach(async () => {
      content = signal('<p>Hallo</p>')
      fixture = TestBed.createComponent(QuillViewComponent, {
        bindings: [inputBinding('content', content), inputBinding('format', format)]
      })
      await fixture.whenStable()
      await vi.waitUntil(() => !!fixture.componentInstance.quillEditor)
    })

    test('should be set html', async () => {
      const component = fixture.componentInstance

      expect(component.quillEditor.getText().trim()).toEqual('Hallo')
    })

    test('should update html', async () => {
      const component = fixture.componentInstance

      content.set('<p>test</p>')
      await fixture.whenStable()

      expect(component.quillEditor.getText().trim()).toEqual('test')
    })
  })

  describe('text', () => {
    let fixture: ComponentFixture<QuillViewComponent>

    let content: WritableSignal<any>
    const format = signal('text')

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [],
        imports: [QuillModule],
        providers: QuillModule.forRoot().providers
      }).compileComponents()
    })

    beforeEach(async () => {
      content = signal('Hallo')
      fixture = TestBed.createComponent(QuillViewComponent, {
        bindings: [inputBinding('content', content), inputBinding('format', format)]
      })
      await fixture.whenStable()
      await vi.waitUntil(() => !!fixture.componentInstance.quillEditor)
    })

    test('should be set text', async () => {
      const component = fixture.componentInstance

      expect(component.quillEditor.getText().trim()).toEqual('Hallo')
    })

    test('should update text', async () => {
      const component = fixture.componentInstance
      content.set('test')
      await fixture.whenStable()

      expect(component.quillEditor.getText().trim()).toEqual('test')
    })
  })

  describe('json', () => {
    let fixture: ComponentFixture<QuillViewComponent>

    let content: WritableSignal<any>
    const format = signal('json')

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [],
        imports: [QuillModule],
        providers: QuillModule.forRoot().providers
      }).compileComponents()
    })

    beforeEach(async () => {
      content = signal(JSON.stringify([{
        insert: 'Hallo'
      }]))
      fixture = TestBed.createComponent(QuillViewComponent, {
        bindings: [inputBinding('content', content), inputBinding('format', format)]
      })
      await fixture.whenStable()
      await vi.waitUntil(() => !!fixture.componentInstance.quillEditor)
    })

    test('should set json string', async () => {
      const component = fixture.componentInstance

      expect(JSON.stringify(component.quillEditor.getContents())).toEqual(JSON.stringify({ ops: [{ insert: 'Hallo\n' }] }))
    })

    test('should update json string', async () => {
      const component = fixture.componentInstance

      content.set(JSON.stringify([{
        insert: 'Hallo 123'
      }]))
      await fixture.whenStable()

      expect(JSON.stringify(component.quillEditor.getContents())).toEqual(JSON.stringify({ ops: [{ insert: 'Hallo 123\n' }] }))
    })
  })
})

describe('Advanced QuillViewComponent', () => {
  @Component({
    imports: [QuillViewComponent],
    template: `
  <quill-view [content]="content" format="html" (onEditorCreated)="handleEditorCreated($event)"></quill-view>
  `
  })
  class AdvancedComponent {
    @ViewChild(QuillViewComponent, { static: true }) view: QuillViewComponent | undefined
    content = '<p>Hallo</p>'
    quillEditor: any

    handleEditorCreated(event: any) {
      this.quillEditor = event
    }
  }

  let fixture: ComponentFixture<AdvancedComponent>

  beforeEach(async () => {
    fixture = TestBed.createComponent(AdvancedComponent)
    vi.spyOn(fixture.componentInstance, 'handleEditorCreated')
    await fixture.whenStable()
    await vi.waitUntil(() => !!fixture.componentInstance.quillEditor)
  })

  test('should emit onEditorCreated with editor instance',  async () => {
    const viewComponent = fixture.debugElement.children[0].componentInstance
    expect(fixture.componentInstance.handleEditorCreated).toHaveBeenCalledWith(viewComponent.quillEditor)
  })
})
