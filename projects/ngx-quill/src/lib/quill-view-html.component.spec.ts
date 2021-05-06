import { Component, ViewChild } from '@angular/core'
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { QuillViewHTMLComponent } from './quill-view-html.component'
import { QuillModule } from './quill.module'



describe('Basic QuillViewHTMLComponent', () => {
  let fixture: ComponentFixture<QuillViewHTMLComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        QuillModule.forRoot()
      ],
      providers: QuillModule.forRoot().providers
    })

    fixture = TestBed.createComponent(QuillViewHTMLComponent)
  })

  it('should render and set default snow theme class', waitForAsync(async () => {
    const element = fixture.nativeElement
    fixture.detectChanges()
    await fixture.whenStable()

    expect(element.querySelectorAll('.ql-editor').length).toBe(1)
    expect(fixture.componentInstance.themeClass).toBe('ql-snow')
    const viewElement = element.querySelector('.ql-container.ql-snow.ngx-quill-view-html > .ql-editor')
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
      imports: [QuillModule],
      providers: QuillModule.forRoot().providers
    })

    fixture = TestBed.createComponent(HTMLComponent) as ComponentFixture<HTMLComponent>
    fixture.detectChanges()
  })
  it('should be set html', waitForAsync(async () => {
    const element = fixture.nativeElement

    await fixture.whenStable()
    const viewElement = element.querySelector('.ql-container.ql-snow.ngx-quill-view-html > .ql-editor')
    expect(viewElement.innerHTML).toEqual('<p>Hallo</p>')
  }))

  it('should update html', waitForAsync(async () => {
    const component = fixture.componentInstance
    await fixture.whenStable()
    component.content = '<p>test</p>'
    fixture.detectChanges()
    await fixture.whenStable()

    const element = fixture.nativeElement
    const viewElement = element.querySelector('.ql-container.ql-snow.ngx-quill-view-html > .ql-editor')
    expect(viewElement.innerHTML).toEqual('<p>test</p>')
  }))
})

describe('QuillViewHTMLComponent - sanitize', () => {
  @Component({
    template: `
  <quill-view-html [content]="content" [sanitize]="sanitize"></quill-view-html>
  `
  })
  class HTMLComponent {
    content = '<p>Hallo <img src="wroooong.jpg" onerror="window.alert(\'sanitize me\')"></p>'
    sanitize = false
  }

  let fixture: ComponentFixture<HTMLComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HTMLComponent],
      imports: [QuillModule],
      providers: QuillModule.forRoot().providers
    })

    fixture = TestBed.createComponent(HTMLComponent)
  })

  it('should NOT sanitize content when sanitize parameter is false', () => {
    fixture.detectChanges()

    const element = fixture.nativeElement
    const viewElement = element.querySelector('.ql-container.ql-snow.ngx-quill-view-html > .ql-editor')
    expect(viewElement.innerHTML).toEqual('<p>Hallo <img src="wroooong.jpg" onerror="window.alert(\'sanitize me\')"></p>')
  })

  it('should sanitize content when sanitize parameter is true', () => {
    const component = fixture.componentInstance
    component.sanitize = true
    fixture.detectChanges()

    const element = fixture.nativeElement
    const viewElement = element.querySelector('.ql-container.ql-snow.ngx-quill-view-html > .ql-editor')
    expect(viewElement.innerHTML).toEqual('<p>Hallo <img src="wroooong.jpg"></p>')
  })
})
