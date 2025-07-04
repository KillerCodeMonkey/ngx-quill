import { Component, ViewChild } from '@angular/core'
import { ComponentFixture, TestBed, inject } from '@angular/core/testing'
import { beforeEach, describe, expect, test } from 'vitest'

import { QuillViewComponent } from './quill-view.component'

import Quill from 'quill'
import { lastValueFrom } from 'rxjs'
import { QuillModule } from './quill.module'
import { QuillService } from './quill.service'

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

  beforeEach(inject([QuillService], async (service: QuillService) => {
    fixture = TestBed.createComponent(QuillViewComponent)
    await vi.waitFor(() => lastValueFrom(service.getQuill()))
    fixture.detectChanges()
    await fixture.whenStable()
  }))

  test('should render and set default snow theme class', async () => {
    const element = fixture.nativeElement
    fixture.detectChanges()
    await fixture.whenStable()

    expect(element.querySelectorAll('.ql-editor').length).toBe(1)
    expect(fixture.componentInstance.quillEditor).toBeDefined()
    const viewElement = element.querySelector('.ql-container.ql-snow.ngx-quill-view > .ql-editor')
    expect(viewElement).toBeDefined()
  })
})

describe('Formats', () => {
  describe('object', () => {
    @Component({
      imports: [QuillModule],
      template: `
    <quill-view [content]="content" [customModules]="[{path: 'modules/test', implementation: impl}]" format="object"></quill-view>
    `
    })
    class ObjectComponent {
      @ViewChild(QuillViewComponent, {
        static: true
      }) view: QuillViewComponent | undefined
      content = [{
        insert: 'Hello'
      }]

      impl = CustomModule
    }

    let fixture: ComponentFixture<ObjectComponent>

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [],
        imports: [QuillModule],
        providers: QuillModule.forRoot().providers
      }).compileComponents()
    })

    beforeEach(inject([QuillService], async (service: QuillService) => {
      fixture = TestBed.createComponent(ObjectComponent)
      await vi.waitFor(() => lastValueFrom(service.getQuill()))
      fixture.detectChanges()
      await fixture.whenStable()
    }))

    test('should be set object', async () => {
      const component = fixture.componentInstance

      await fixture.whenStable()
      expect(JSON.stringify(component.view!.quillEditor.getContents())).toEqual(JSON.stringify({ ops: [{ insert: 'Hello\n' }] }))
    })

    test('should update object content', async () => {
      const component = fixture.componentInstance
      await fixture.whenStable()
      component.content = [{ insert: '1234' }]
      fixture.detectChanges()

      await fixture.whenStable()
      expect(JSON.stringify(component.view!.quillEditor.getContents())).toEqual(JSON.stringify({ ops: [{ insert: '1234\n' }] }))
    })
  })

  describe('html', () => {
    @Component({
      imports: [QuillModule],
      template: `
    <quill-view [content]="content" format="html"></quill-view>
    `
    })
    class HTMLComponent {
      @ViewChild(QuillViewComponent, {
        static: true
      }) view: QuillViewComponent | undefined
      content = '<p>Hallo</p>'
    }

    let fixture: ComponentFixture<HTMLComponent>

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [],
        imports: [QuillModule],
        providers: QuillModule.forRoot().providers
      }).compileComponents()
    })

    beforeEach(inject([QuillService], async (service: QuillService) => {
      fixture = TestBed.createComponent(HTMLComponent)
      await vi.waitFor(() => lastValueFrom(service.getQuill()))
      fixture.detectChanges()
      await fixture.whenStable()
    }))

    test('should be set html', async () => {
      const component = fixture.componentInstance

      await fixture.whenStable()
      expect(component.view!.quillEditor.getText().trim()).toEqual('Hallo')
    })

    test('should update html', async () => {
      const component = fixture.componentInstance
      await fixture.whenStable()
      component.content = '<p>test</p>'
      fixture.detectChanges()
      await fixture.whenStable()

      expect(component.view!.quillEditor.getText().trim()).toEqual('test')
    })
  })

  describe('text', () => {
    @Component({
      imports: [QuillModule],
      template: `
    <quill-view [content]="content" format="text"></quill-view>
    `
    })
    class TextComponent {
      @ViewChild(QuillViewComponent, {
        static: true
      }) view: QuillViewComponent | undefined
      content = 'Hallo'
    }

    let fixture: ComponentFixture<TextComponent>

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [],
        imports: [QuillModule],
        providers: QuillModule.forRoot().providers
      }).compileComponents()
    })

    beforeEach(inject([QuillService], async (service: QuillService) => {
      fixture = TestBed.createComponent(TextComponent)
      await vi.waitFor(() => lastValueFrom(service.getQuill()))
      fixture.detectChanges()
      await fixture.whenStable()
    }))

    test('should be set text', async () => {
      const component = fixture.componentInstance
      await fixture.whenStable()
      expect(component.view!.quillEditor.getText().trim()).toEqual('Hallo')
    })

    test('should update text', async () => {
      const component = fixture.componentInstance
      await fixture.whenStable()
      component.content = 'test'
      fixture.detectChanges()
      await fixture.whenStable()

      expect(component.view!.quillEditor.getText().trim()).toEqual('test')
    })
  })

  describe('json', () => {
    @Component({
      imports: [QuillModule],
      template: `
    <quill-view [content]="content" format="json"></quill-view>
    `
    })
    class JSONComponent {
      @ViewChild(QuillViewComponent, {
        static: true
      }) view: QuillViewComponent | undefined
      content = JSON.stringify([{
        insert: 'Hallo'
      }])
    }

    let fixture: ComponentFixture<JSONComponent>

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [],
        imports: [QuillModule],
        providers: QuillModule.forRoot().providers
      }).compileComponents()
    })

    beforeEach(inject([QuillService], async (service: QuillService) => {
      fixture = TestBed.createComponent(JSONComponent)
      await vi.waitFor(() => lastValueFrom(service.getQuill()))
      fixture.detectChanges()
      await fixture.whenStable()
    }))

    test('should set json string', async () => {
      const component = fixture.componentInstance
      await fixture.whenStable()
      await fixture.whenStable()

      expect(JSON.stringify(component.view!.quillEditor.getContents())).toEqual(JSON.stringify({ ops: [{ insert: 'Hallo\n' }] }))
    })

    test('should update json string', async () => {
      const component = fixture.componentInstance
      await fixture.whenStable()

      component.content = JSON.stringify([{
        insert: 'Hallo 123'
      }])
      fixture.detectChanges()
      await fixture.whenStable()

      expect(JSON.stringify(component.view!.quillEditor.getContents())).toEqual(JSON.stringify({ ops: [{ insert: 'Hallo 123\n' }] }))
    })
  })
})

describe('Advanced QuillViewComponent', () => {

  @Component({
    imports: [QuillModule],
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
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [QuillModule],
      providers: QuillModule.forRoot().providers
    }).compileComponents()
  })

  beforeEach(inject([QuillService], async (service: QuillService) => {
    fixture = TestBed.createComponent(AdvancedComponent)
    vi.spyOn(fixture.componentInstance, 'handleEditorCreated')

    await vi.waitFor(() => lastValueFrom(service.getQuill()))

    fixture.detectChanges()
    await fixture.whenStable()
  }))

  test('should emit onEditorCreated with editor instance',  async () => {
    const viewComponent = fixture.debugElement.children[0].componentInstance
    expect(fixture.componentInstance.handleEditorCreated).toHaveBeenCalledWith(viewComponent.quillEditor)
  })
})
