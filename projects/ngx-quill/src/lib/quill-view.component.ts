import { isPlatformServer } from '@angular/common'
import type QuillType from 'quill'

import {
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Output,
  PLATFORM_ID,
  Renderer2,
  SecurityContext,
  ViewEncapsulation,
  afterNextRender,
  inject,
  input
} from '@angular/core'
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import { DomSanitizer } from '@angular/platform-browser'
import { mergeMap } from 'rxjs/operators'

import { CustomModule, CustomOption, QuillBeforeRender, QuillModules } from 'ngx-quill/config'

import { getFormat } from './helpers'
import { QuillService } from './quill.service'

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'quill-view',
  styles: [`
.ql-container.ngx-quill-view {
  border: 0;
}
`],
  template: `
  <div quill-view-element></div>
`,
})
export class QuillViewComponent {
  readonly format = input<'object' | 'html' | 'text' | 'json' | undefined>(
    undefined
  )
  readonly theme = input<string | undefined>(undefined)
  readonly modules = input<QuillModules | undefined>(undefined)
  readonly debug = input<'warn' | 'log' | 'error' | false>(false)
  readonly formats = input<string[] | null | undefined>(undefined)
  readonly sanitize = input<boolean | undefined>(undefined)
  readonly beforeRender = input<QuillBeforeRender>()
  readonly strict = input(true)
  readonly content = input<any>()
  readonly customModules = input<CustomModule[]>([])
  readonly customOptions = input<CustomOption[]>([])

  @Output() onEditorCreated = new EventEmitter<any>()

  quillEditor!: QuillType
  editorElem!: HTMLElement

  private readonly elementRef = inject(ElementRef)
  private readonly renderer = inject(Renderer2)
  private readonly service = inject(QuillService)
  private readonly sanitizer = inject(DomSanitizer)
  private readonly platformId = inject(PLATFORM_ID)
  private readonly destroyRef = inject(DestroyRef)

  constructor() {
    afterNextRender(() => {
      if (isPlatformServer(this.platformId)) {
        return
      }

      const quillSubscription = this.service.getQuill().pipe(
        mergeMap((Quill) => this.service.beforeRender(Quill, this.customModules(), this.beforeRender()))
      ).subscribe(Quill => {
        const modules = Object.assign({}, this.modules() || this.service.config.modules)
        modules.toolbar = false

        this.customOptions().forEach((customOption) => {
          const newCustomOption = Quill.import(customOption.import)
          newCustomOption.whitelist = customOption.whitelist
          Quill.register(newCustomOption, true)
        })

        let debug = this.debug()
        if (!debug && debug !== false && this.service.config.debug) {
          debug = this.service.config.debug
        }

        let formats = this.formats()
        if (formats === undefined) {
          formats = this.service.config.formats ? [...this.service.config.formats] : (this.service.config.formats === null ? null : undefined)
        }
        const theme = this.theme() || (this.service.config.theme ? this.service.config.theme : 'snow')

        this.editorElem = this.elementRef.nativeElement.querySelector(
          '[quill-view-element]'
        ) as HTMLElement

        this.quillEditor = new Quill(this.editorElem, {
          debug,
          formats,
          modules,
          readOnly: true,
          strict: this.strict(),
          theme
        })

        this.renderer.addClass(this.editorElem, 'ngx-quill-view')

        if (this.content()) {
          this.valueSetter(this.quillEditor, this.content())
        }

        // listening to the `onEditorCreated` event inside the template, for instance `<quill-view (onEditorCreated)="...">`.
        if (!this.onEditorCreated.observed) {
          return
        }

        this.onEditorCreated.emit(this.quillEditor)
      })

      this.destroyRef.onDestroy(() => quillSubscription.unsubscribe())
    })

    toObservable(this.content).pipe(takeUntilDestroyed()).subscribe((content) => {
      if (!this.quillEditor) {
        return
      }

      if (content) {
        this.valueSetter(this.quillEditor, content)
      }
    })
  }

  valueSetter = (quillEditor: QuillType, value: any): any => {
    const format = getFormat(this.format(), this.service.config.format)
    let content = value
    if (format === 'text') {
      quillEditor.setText(content)
    } else {
      if (format === 'html') {
        const sanitize = [true, false].includes(this.sanitize()) ? this.sanitize() : (this.service.config.sanitize || false)
        if (sanitize) {
          value = this.sanitizer.sanitize(SecurityContext.HTML, value)
        }
        content = quillEditor.clipboard.convert({ html: value })
      } else if (format === 'json') {
        try {
          content = JSON.parse(value)
        } catch {
          content = [{ insert: value }]
        }
      }
      quillEditor.setContents(content)
    }
  }
}
