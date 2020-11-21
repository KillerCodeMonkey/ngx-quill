import { isPlatformServer } from '@angular/common'
import QuillType from 'quill'
import { QuillModules } from './quill-editor.interfaces'

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
  ViewEncapsulation,
  NgZone,
  SecurityContext
} from '@angular/core'

import { CustomOption, CustomModule } from './quill-editor.interfaces'
import {getFormat} from './helpers'
import { QuillService } from './quill.service'
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'quill-view',
  styles: [`
.ql-container.ngx-quill-view {
  border: 0;
}
`],
  template: `
`
})
export class QuillViewComponent implements AfterViewInit, OnChanges {
  @Input() format?: 'object' | 'html' | 'text' | 'json'
  @Input() theme?: string
  @Input() modules?: QuillModules
  @Input() debug?: 'warn' | 'log' | 'error' | false
  @Input() formats?: string[] | null
  @Input() sanitize = false
  @Input() strict = true
  @Input() content: any
  @Input() customModules: CustomModule[] = []
  @Input() customOptions: CustomOption[] = []
  @Input() preserveWhitespace = false

  quillEditor!: QuillType
  editorElem!: HTMLElement

  constructor(
    public elementRef: ElementRef,
    protected renderer: Renderer2,
    protected zone: NgZone,
    protected service: QuillService,
    protected domSanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) protected platformId: any,
  ) {}

  valueSetter = (quillEditor: QuillType, value: any): any => {
    const format = getFormat(this.format, this.service.config.format)
    let content = value
    if (format === 'text') {
      quillEditor.setText(content)
    } else {
      if (format === 'html') {
        if (this.sanitize) {
          value = this.domSanitizer.sanitize(SecurityContext.HTML, value)
        }
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
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.quillEditor) {
      return
    }
    if (changes.content) {
      this.valueSetter(this.quillEditor, changes.content.currentValue)
    }
  }

  async ngAfterViewInit() {
    if (isPlatformServer(this.platformId)) {
      return
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const Quill = await this.service.getQuill()

    const modules = Object.assign({}, this.modules || this.service.config.modules)
    modules.toolbar = false

    this.customOptions.forEach((customOption) => {
      const newCustomOption = Quill.import(customOption.import)
      newCustomOption.whitelist = customOption.whitelist
      Quill.register(newCustomOption, true)
    })

    this.customModules.forEach(({implementation, path}) => {
      Quill.register(path, implementation)
    })

    let debug = this.debug
    if (!debug && debug !== false && this.service.config.debug) {
      debug = this.service.config.debug
    }

    let formats = this.formats
    if (!formats && formats === undefined) {
      formats = this.service.config.formats ?
        Object.assign({}, this.service.config.formats) : (this.service.config.formats === null ? null : undefined)
    }
    const theme = this.theme || (this.service.config.theme ? this.service.config.theme : 'snow')

    this.elementRef.nativeElement.insertAdjacentHTML(
      'afterbegin',
      this.preserveWhitespace ? '<pre quill-view-element></pre>' : '<div quill-view-element></div>'
    )

    this.editorElem = this.elementRef.nativeElement.querySelector(
      '[quill-view-element]'
    ) as HTMLElement

    this.zone.runOutsideAngular(() => {
      this.quillEditor = new Quill(this.editorElem, {
        debug: debug as any,
        formats: formats as any,
        modules,
        readOnly: true,
        strict: this.strict,
        theme
      })
    })

    this.renderer.addClass(this.editorElem, 'ngx-quill-view')

    if (this.content) {
      this.valueSetter(this.quillEditor, this.content)
    }
  }
}
