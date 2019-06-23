import { Component, ViewChild } from '@angular/core'
import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { QuillViewHTMLComponent } from '../src/quill-view-html.component'

import { QuillModule } from './quill.module'

describe('Basic QuillViewHTMLComponent', () => {
  let fixture: ComponentFixture<QuillViewHTMLComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        QuillModule.forRoot()
      ]
    })

    fixture = TestBed.createComponent(QuillViewHTMLComponent)
  })

  it('should render and set default snow theme class', async(async () => {
    const element = fixture.nativeElement
    fixture.detectChanges()
    await fixture.whenStable()

    expect(element.querySelectorAll('.ql-editor').length).toBe(1)
    expect(fixture.componentInstance.themeClass).toBe('ql-snow')
    const viewElement = element.querySelector('.ql-container.ql-snow > .ql-editor.ngx-quill-view-html')
    expect(viewElement).toBeDefined()
  }))
})

describe('QuillViewHTMLComponent - content', () => {
  @Component({
    template: `
  <quill-view-html [content]="content" theme="snow"></quill-view-html>
  `
  })
  class HTMLComponent {
    @ViewChild(QuillViewHTMLComponent, {
      static: true
    }) view: QuillViewHTMLComponent | undefined
    content = '<p>Hallo</p>'
  }

  let fixture: ComponentFixture<HTMLComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HTMLComponent],
      imports: [QuillModule]
    })

    fixture = TestBed.createComponent(HTMLComponent) as ComponentFixture<HTMLComponent>
    fixture.detectChanges()
  })
  it('should be set html', async(async () => {
    const element = fixture.nativeElement

    await fixture.whenStable()
    const viewElement = element.querySelector('.ql-container.ql-snow > .ql-editor.ngx-quill-view-html')
    expect(viewElement.innerHTML).toEqual('<p>Hallo</p>')
  }))

  it('should update html', async(async () => {
    const component = fixture.componentInstance
    await fixture.whenStable()
    component.content = '<p>test</p>'
    fixture.detectChanges()
    await fixture.whenStable()

    const element = fixture.nativeElement
    const viewElement = element.querySelector('.ql-container.ql-snow > .ql-editor.ngx-quill-view-html')
    expect(viewElement.innerHTML).toEqual('<p>test</p>')
  }))
})
