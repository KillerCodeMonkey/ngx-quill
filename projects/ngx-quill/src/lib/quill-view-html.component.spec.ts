import { Component, ViewChild } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { beforeEach, describe, expect, test } from 'vitest'
import { QuillViewHTMLComponent } from './quill-view-html.component'
import { QuillModule } from './quill.module'

vi.spyOn(window, 'alert').mockImplementation(() => { return })

describe('Basic QuillViewHTMLComponent', () => {
  let fixture: ComponentFixture<QuillViewHTMLComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        QuillModule.forRoot()
      ],
      providers: QuillModule.forRoot().providers
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(QuillViewHTMLComponent)
  })

  test('should render and set default snow theme class', async () => {
    const element = fixture.nativeElement
    fixture.detectChanges()
    await fixture.whenStable()

    expect(element.querySelectorAll('.ql-editor').length).toBe(1)
    expect(fixture.componentInstance.themeClass()).toBe('ql-snow')
    const viewElement = element.querySelector('.ql-container.ql-snow.ngx-quill-view-html > .ql-editor')
    expect(viewElement).toBeDefined()
  })
})

describe('QuillViewHTMLComponent - content', () => {
  @Component({
    imports: [QuillModule],
    template: `
  <quill-view-html [content]="content" [theme]="theme"></quill-view-html>
  `
  })
  class HTMLComponent {
    @ViewChild(QuillViewHTMLComponent, {
      static: true
    }) view: QuillViewHTMLComponent | undefined
    content = '<p>Hallo</p>'
    theme = 'snow'

  }

  let fixture: ComponentFixture<HTMLComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [QuillModule],
      providers: QuillModule.forRoot().providers
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(HTMLComponent) as ComponentFixture<HTMLComponent>
    fixture.detectChanges()
  })

  test('should be set html', async () => {
    const element = fixture.nativeElement

    await fixture.whenStable()
    const viewElement = element.querySelector('.ql-container.ql-snow.ngx-quill-view-html > .ql-editor')
    expect(viewElement.innerHTML).toEqual('<p>Hallo</p>')
  })

  test('should update html', async () => {
    const component = fixture.componentInstance
    await fixture.whenStable()
    component.content = '<p>test</p>'
    fixture.detectChanges()
    await fixture.whenStable()

    const element = fixture.nativeElement
    const viewElement = element.querySelector('.ql-container.ql-snow.ngx-quill-view-html > .ql-editor')
    expect(viewElement.innerHTML).toEqual('<p>test</p>')
  })

  test('should set default theme when not set', async () => {
    const component = fixture.componentInstance
    await fixture.whenStable()
    component.theme = undefined
    fixture.detectChanges()
    await fixture.whenStable()

    const element = fixture.nativeElement
    const viewElement = element.querySelector('.ql-container.ql-snow.ngx-quill-view-html > .ql-editor')
    expect(viewElement.innerHTML).toEqual('<p>Hallo</p>')
  })

  test('should update theme', async () => {
    const component = fixture.componentInstance
    await fixture.whenStable()
    component.theme = 'bubble'
    fixture.detectChanges()
    await fixture.whenStable()

    const element = fixture.nativeElement
    const viewElement = element.querySelector('.ql-container.ql-bubble.ngx-quill-view-html > .ql-editor')
    expect(viewElement.innerHTML).toEqual('<p>Hallo</p>')
  })
})

describe('QuillViewHTMLComponent - sanitize', () => {
  @Component({
    imports: [QuillModule],
    template: `
  <quill-view-html [content]="content" [sanitize]="sanitize"></quill-view-html>
  `
  })
  class HTMLComponent {
    content = '<p>Hallo <img src="wroooong.jpg" onerror="window.alert(\'sanitize me\')"></p>'
    sanitize = false
  }

  let fixture: ComponentFixture<HTMLComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [QuillModule],
      providers: QuillModule.forRoot().providers
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(HTMLComponent)
  })

  test('should NOT sanitize content when sanitize parameter is false', () => {
    fixture.detectChanges()

    const element = fixture.nativeElement
    const viewElement = element.querySelector('.ql-container.ql-snow.ngx-quill-view-html > .ql-editor')
    expect(viewElement.innerHTML).toEqual('<p>Hallo <img src="wroooong.jpg" onerror="window.alert(\'sanitize me\')"></p>')
  })

  test('should sanitize content when sanitize parameter is true', () => {
    const component = fixture.componentInstance
    component.sanitize = true
    fixture.detectChanges()

    const element = fixture.nativeElement
    const viewElement = element.querySelector('.ql-container.ql-snow.ngx-quill-view-html > .ql-editor')
    expect(viewElement.innerHTML).toEqual('<p>Hallo <img src="wroooong.jpg"></p>')
  })

  test('should use default sanatize when not set', () => {
    const component = fixture.componentInstance
    component.sanitize = undefined
    fixture.detectChanges()

    const element = fixture.nativeElement
    const viewElement = element.querySelector('.ql-container.ql-snow.ngx-quill-view-html > .ql-editor')
    expect(viewElement.innerHTML).toEqual('<p>Hallo <img src="wroooong.jpg" onerror="window.alert(\'sanitize me\')"></p>')
  })
})
