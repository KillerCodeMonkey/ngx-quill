import { inputBinding, signal, WritableSignal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { beforeEach, describe, expect, test } from 'vitest'
import { QuillViewHTMLComponent } from './quill-view-html.component'

vi.spyOn(window, 'alert').mockImplementation(() => { return })

describe('Basic QuillViewHTMLComponent', () => {
  let fixture: ComponentFixture<QuillViewHTMLComponent>

  beforeEach(async () => {
    fixture = TestBed.createComponent(QuillViewHTMLComponent)
    await fixture.whenStable()
  })

  test('should render and set default snow theme class', async () => {
    const element = fixture.nativeElement

    expect(element.querySelectorAll('.ql-editor').length).toBe(1)
    expect(fixture.componentInstance.themeClass()).toBe('ql-snow ngx-quill-view-html')
    const viewElement = element.querySelector('.ql-container.ql-snow.ngx-quill-view-html > .ql-editor')
    expect(viewElement).toBeDefined()
  })
})

describe('QuillViewHTMLComponent - content', () => {
  let fixture: ComponentFixture<QuillViewHTMLComponent>
  let content: WritableSignal<any>
  const theme = signal<string | undefined>('snow')

  beforeEach(async () => {
    content = signal('<p>Hallo</p>')
    fixture = TestBed.createComponent(QuillViewHTMLComponent, {
      bindings: [inputBinding('content', content), inputBinding('theme', theme)]
    }) as ComponentFixture<QuillViewHTMLComponent>
    await fixture.whenStable()
  })

  test('should be set html', async () => {
    const element = fixture.nativeElement

    const viewElement = element.querySelector('.ql-container.ql-snow.ngx-quill-view-html > .ql-editor')
    expect(viewElement.innerHTML).toEqual('<p>Hallo</p>')
  })

  test('should update html', async () => {
    content.set('<p>test</p>')
    await fixture.whenStable()

    const element = fixture.nativeElement
    const viewElement = element.querySelector('.ql-container.ql-snow.ngx-quill-view-html > .ql-editor')
    expect(viewElement.innerHTML).toEqual('<p>test</p>')
  })

  test('should set default theme when not set', async () => {
    theme.set(undefined)
    await fixture.whenStable()

    const element = fixture.nativeElement
    const viewElement = element.querySelector('.ql-container.ql-snow.ngx-quill-view-html > .ql-editor')
    expect(viewElement.innerHTML).toEqual('<p>Hallo</p>')
  })

  test('should update theme', async () => {
    theme.set('bubble')
    await fixture.whenStable()

    const element = fixture.nativeElement
    const viewElement = element.querySelector('.ql-container.ql-bubble.ngx-quill-view-html > .ql-editor')
    expect(viewElement.innerHTML).toEqual('<p>Hallo</p>')
  })
})

describe('QuillViewHTMLComponent - sanitize', () => {
  let fixture: ComponentFixture<QuillViewHTMLComponent>
  let content: WritableSignal<any>
  const sanitize = signal<boolean | undefined>(false)

  beforeEach(async () => {
    content = signal('<p>Hallo <img src="wroooong.jpg" onerror="window.alert(\'sanitize me\')"></p>')
    fixture = TestBed.createComponent(QuillViewHTMLComponent, {
      bindings: [inputBinding('content', content), inputBinding('sanitize', sanitize)]
    }) as ComponentFixture<QuillViewHTMLComponent>
    await fixture.whenStable()
  })

  test('should NOT sanitize content when sanitize parameter is false', () => {
    const element = fixture.nativeElement
    const viewElement = element.querySelector('.ql-container.ql-snow.ngx-quill-view-html > .ql-editor')
    expect(viewElement.innerHTML).toEqual('<p>Hallo <img src="wroooong.jpg" onerror="window.alert(\'sanitize me\')"></p>')
  })

  test('should sanitize content when sanitize parameter is true', async () => {
    sanitize.set(true)
    await fixture.whenStable()

    const element = fixture.nativeElement
    const viewElement = element.querySelector('.ql-container.ql-snow.ngx-quill-view-html > .ql-editor')
    expect(viewElement.innerHTML).toEqual('<p>Hallo <img src="wroooong.jpg"></p>')
  })

  test('should use default sanatize when not set', async () => {
    sanitize.set(undefined)
    await fixture.whenStable()

    const element = fixture.nativeElement
    const viewElement = element.querySelector('.ql-container.ql-snow.ngx-quill-view-html > .ql-editor')
    expect(viewElement.innerHTML).toEqual('<p>Hallo <img src="wroooong.jpg" onerror="window.alert(\'sanitize me\')"></p>')
  })
})
