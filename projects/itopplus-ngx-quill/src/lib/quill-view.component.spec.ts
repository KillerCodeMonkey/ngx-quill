/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-classes-per-file */
import { Component, ViewChild } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { QuillViewComponent } from './quill-view.component'

import { QuillModule } from './quill.module'
import Quill from 'quill'


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
    TestBed.configureTestingModule({
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
    })

    fixture = TestBed.createComponent(QuillViewComponent)
    fixture.detectChanges()
    await fixture.whenStable()
  })

  it('should render and set default snow theme class', async () => {
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

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ObjectComponent],
        imports: [QuillModule],
        providers: QuillModule.forRoot().providers
      })

      fixture = TestBed.createComponent(ObjectComponent) as ComponentFixture<ObjectComponent>
      fixture.detectChanges()
    })

    it('should be set object', async () => {
      const component = fixture.componentInstance

      await fixture.whenStable()
      expect(JSON.stringify(component.view!.quillEditor.getContents())).toEqual(JSON.stringify({ops: [{insert: 'Hello\n'}]}))
    })

    it('should update object content', async () => {
      const component = fixture.componentInstance
      await fixture.whenStable()
      component.content = [{ insert: '1234' }]
      fixture.detectChanges()

      await fixture.whenStable()
      expect(JSON.stringify(component.view!.quillEditor.getContents())).toEqual(JSON.stringify({ops: [{insert: '1234\n'}]}))
    })
  })

  describe('html', () => {
    @Component({
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

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [HTMLComponent],
        imports: [QuillModule],
        providers: QuillModule.forRoot().providers
      })

      fixture = TestBed.createComponent(HTMLComponent) as ComponentFixture<HTMLComponent>
      fixture.detectChanges()
    })
    it('should be set html', async () => {
      const component = fixture.componentInstance

      await fixture.whenStable()
      expect(component.view!.quillEditor.getText().trim()).toEqual('Hallo')
    })

    it('should update html', async () => {
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

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TextComponent],
        imports: [QuillModule],
        providers: QuillModule.forRoot().providers
      })

      fixture = TestBed.createComponent(TextComponent) as ComponentFixture<TextComponent>
      fixture.detectChanges()
    })
    it('should be set text', async () => {
      const component = fixture.componentInstance
      await fixture.whenStable()
      expect(component.view!.quillEditor.getText().trim()).toEqual('Hallo')
    })

    it('should update text', async () => {
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

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [JSONComponent],
        imports: [QuillModule],
        providers: QuillModule.forRoot().providers
      })

      fixture = TestBed.createComponent(JSONComponent) as ComponentFixture<JSONComponent>
      fixture.detectChanges()
    })

    it('should set json string', async () => {
      const component = fixture.componentInstance
      await fixture.whenStable()
      await fixture.whenStable()

      expect(JSON.stringify(component.view!.quillEditor.getContents())).toEqual(JSON.stringify({ops: [{insert: 'Hallo\n'}]}))
    })

    it('should update json string', async () => {
      const component = fixture.componentInstance
      await fixture.whenStable()

      component.content = JSON.stringify([{
        insert: 'Hallo 123'
      }])
      fixture.detectChanges()
      await fixture.whenStable()

      expect(JSON.stringify(component.view!.quillEditor.getContents())).toEqual(JSON.stringify({ops: [{insert: 'Hallo 123\n'}]}))
    })
  })
})

describe('Advanced QuillViewComponent', () => {

  @Component({
    template: `
  <quill-view [content]="content" format="html" (onEditorCreated)="handleEditorCreated($event)"></quill-view>
  `
  })
  class AdvancedComponent {
    @ViewChild(QuillViewComponent, {static: true}) view: QuillViewComponent | undefined
    content = '<p>Hallo</p>'
    quillEditor: any

    handleEditorCreated(event: any) {
      this.quillEditor = event
    }
  }

  let fixture: ComponentFixture<AdvancedComponent>

  beforeEach(async () => {

    TestBed.configureTestingModule({
      declarations: [AdvancedComponent],
      imports: [QuillModule],
      providers: QuillModule.forRoot().providers
    }).compileComponents()

    fixture = TestBed.createComponent(AdvancedComponent) as ComponentFixture<AdvancedComponent>
  })

  it('should emit onEditorCreated with editor instance',  async () => {

    spyOn(fixture.componentInstance, 'handleEditorCreated')
    fixture.detectChanges()

    await fixture.whenStable()

    const viewComponent = fixture.debugElement.children[0].componentInstance
    expect(fixture.componentInstance.handleEditorCreated).toHaveBeenCalledWith(viewComponent.quillEditor)
  })
})
