import { isPlatformServer } from '@angular/common'

import { QUILL_CONFIG_TOKEN, QuillConfig, QuillFormat, QuillModules } from './quill-editor.interfaces'

import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  PLATFORM_ID,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'

import { defaultModules } from './quill-defaults'
import { CustomOption } from './quill-editor.component'

// Because quill uses `document` directly, we cannot `import` during SSR
// instead, we load dynamically via `require('quill')` in `ngAfterViewInit()`
declare var require: any
// tslint:disable-next-line:variable-name
let Quill: any = null

const getFormat = (format?: QuillFormat, configFormat?: QuillFormat): QuillFormat => {
  const passedFormat = format || configFormat
  return passedFormat || 'html'
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'quill-view',
  styles: [`
.ql-container.ngx-quill-view {
  border: 0;
}
`],
  template: `
  <div #quillView></div>
`
})
export class QuillViewComponent implements AfterViewInit, OnChanges {
  @ViewChild('quillView', {
    static: true
  }) viewElement: ElementRef | undefined

  quillEditor: any
  editorElem: HTMLElement | undefined

  @Input() format?: 'object' | 'html' | 'text' | 'json'
  @Input() theme?: string
  @Input() modules?: QuillModules
  @Input() debug?: 'warn' | 'log' | 'error' | false
  @Input() formats?: string[] | null
  @Input() strict: boolean = true
  @Input() content: any
  @Input() customOptions: CustomOption[] = []

  constructor(
    // tslint:disable-next-line:ban-types
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(QUILL_CONFIG_TOKEN) private config: QuillConfig,
    private renderer: Renderer2
  ) {}

  valueSetter = (quillEditor: any, value: any): any => {
    const format = getFormat(this.format, this.config.format)
    let content = value
    if (format === 'html' || format === 'text') {
      content = quillEditor.clipboard.convert(value)
    } else if (format === 'json') {
      try {
        content = JSON.parse(value)
      } catch (e) {
        content = [{ insert: value }]
      }
    }
    quillEditor.setContents(content)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.quillEditor) {
      return
    }
    if (changes.content) {
      this.valueSetter(this.quillEditor, changes.content.currentValue)
    }
  }

  ngAfterViewInit() {
    if (isPlatformServer(this.platformId)) {
      return
    }
    if (!Quill) {
      Quill = require('quill')
    }

    this.editorElem = this.viewElement!.nativeElement

    const modules = this.modules || (this.config.modules || defaultModules)
    modules.toolbar = false

    this.customOptions.forEach((customOption) => {
      const newCustomOption = Quill.import(customOption.import)
      newCustomOption.whitelist = customOption.whitelist
      Quill.register(newCustomOption, true)
    })

    let debug = this.debug
    if (!debug && debug !== false && this.config.debug) {
      debug = this.config.debug
    }

    let formats = this.formats
    if (!formats && formats === undefined) {
      formats = this.config.formats || this.config.formats === null ? this.config.formats : undefined
    }
    const theme = this.theme || (this.config.theme ? this.config.theme : 'snow')

    this.quillEditor = new Quill(this.editorElem, {
      debug,
      formats,
      modules,
      readOnly: true,
      strict: this.strict,
      theme
    })

    this.renderer.addClass(this.editorElem, 'ngx-quill-view')

    if (this.content) {
      this.valueSetter(this.quillEditor, this.content)
    }
  }
}
