/* eslint-disable @typescript-eslint/no-explicit-any */
import { isPlatformServer } from '@angular/common'
import type QuillType from 'quill'

import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnChanges,
  PLATFORM_ID,
  Renderer2,
  SimpleChanges,
  ViewEncapsulation,
  NgZone,
  SecurityContext,
  OnDestroy,
  input,
  EventEmitter,
  Output,
  inject,
  DestroyRef
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Subscription } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

import { CustomOption, CustomModule, QuillModules } from 'ngx-quill/config'

import { getFormat, raf$ } from './helpers'
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
  <div quill-view-element></div>
`,
  standalone: true
})
export class QuillViewComponent implements AfterViewInit, OnChanges, OnDestroy {
  readonly format = input<'object' | 'html' | 'text' | 'json' | undefined>(
    undefined
  )
  readonly theme = input<string | undefined>(undefined)
  readonly modules = input<QuillModules | undefined>(undefined)
  readonly debug = input<'warn' | 'log' | 'error' | false>(false)
  readonly formats = input<string[] | null | undefined>(undefined)
  readonly sanitize = input<boolean | undefined>(false)
  readonly beforeRender = input<() => Promise<void> | undefined>(undefined)
  readonly strict = input(true)
  readonly content = input<any>()
  readonly customModules = input<CustomModule[]>([])
  readonly customOptions = input<CustomOption[]>([])

  @Output() onEditorCreated: EventEmitter<any> = new EventEmitter()

  quillEditor!: QuillType
  editorElem!: HTMLElement

  private quillSubscription: Subscription | null = null

  private destroyRef = inject(DestroyRef)

  constructor(
    public elementRef: ElementRef,
    protected renderer: Renderer2,
    protected zone: NgZone,
    protected service: QuillService,
    protected domSanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) protected platformId: any,
  ) {}

  valueSetter = (quillEditor: QuillType, value: any): any => {
    const format = getFormat(this.format(), this.service.config.format)
    let content = value
    if (format === 'text') {
      quillEditor.setText(content)
    } else {
      if (format === 'html') {
        const sanitize = [true, false].includes(this.sanitize()) ? this.sanitize() : (this.service.config.sanitize || false)
        if (sanitize) {
          value = this.domSanitizer.sanitize(SecurityContext.HTML, value)
        }
        content = quillEditor.clipboard.convert({html: value})
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

  ngAfterViewInit() {
    if (isPlatformServer(this.platformId)) {
      return
    }

    this.quillSubscription = this.service.getQuill().pipe(
      mergeMap((Quill) => {
        const promises = [this.service.registerCustomModules(Quill, this.customModules())]
        const beforeRender = this.beforeRender() ?? this.service.config.beforeRender
        if (beforeRender) {
          promises.push(beforeRender())
        }
        return Promise.all(promises).then(() => Quill)
      })
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
      if (!formats && formats === undefined) {
        formats = this.service.config.formats ? [...this.service.config.formats] : (this.service.config.formats === null ? null : undefined)
      }
      const theme = this.theme() || (this.service.config.theme ? this.service.config.theme : 'snow')

      this.editorElem = this.elementRef.nativeElement.querySelector(
        '[quill-view-element]'
      ) as HTMLElement

      this.zone.runOutsideAngular(() => {
        this.quillEditor = new Quill(this.editorElem, {
          debug: debug as any,
          formats: formats as any,
          modules,
          readOnly: true,
          strict: this.strict(),
          theme
        })
      })

      this.renderer.addClass(this.editorElem, 'ngx-quill-view')

      if (this.content()) {
        this.valueSetter(this.quillEditor, this.content())
      }

      // The `requestAnimationFrame` triggers change detection. There's no sense to invoke the `requestAnimationFrame` if anyone is
      // listening to the `onEditorCreated` event inside the template, for instance `<quill-view (onEditorCreated)="...">`.
      if (!this.onEditorCreated.observed) {
        return
      }

      // The `requestAnimationFrame` will trigger change detection and `onEditorCreated` will also call `markDirty()`
      // internally, since Angular wraps template event listeners into `listener` instruction. We're using the `requestAnimationFrame`
      // to prevent the frame drop and avoid `ExpressionChangedAfterItHasBeenCheckedError` error.
      raf$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.onEditorCreated.emit(this.quillEditor)
      })
    })
  }

  ngOnDestroy(): void {
    this.quillSubscription?.unsubscribe()
    this.quillSubscription = null
  }
}
