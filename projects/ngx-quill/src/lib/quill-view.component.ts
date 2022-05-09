import { isPlatformServer } from '@angular/common'
import QuillType from 'quill'
import { QuillModules } from './quill-editor.interfaces'

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  Output,
  OnChanges,
  PLATFORM_ID,
  Renderer2,
  SimpleChanges,
  ViewEncapsulation,
  NgZone,
  SecurityContext,
  OnDestroy,
  OnInit
} from '@angular/core'
import { Subscription } from 'rxjs'

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
<div quill-view-element *ngIf="!preserve"></div>
<pre quill-view-element *ngIf="preserve"></pre>
`
})
export class QuillViewComponent implements AfterViewInit, OnChanges, OnDestroy, OnInit {
  @Input() format?: 'object' | 'html' | 'text' | 'json'
  @Input() theme?: string
  @Input() modules?: QuillModules
  @Input() debug?: 'warn' | 'log' | 'error' | false
  @Input() formats?: string[] | null
  @Input() sanitize?: boolean
  @Input() strict = true
  @Input() content: any
  @Input() customModules: CustomModule[] = []
  @Input() customOptions: CustomOption[] = []
  @Input() preserveWhitespace = false

  @Output() onEditorCreated: EventEmitter<any> = new EventEmitter()

  quillEditor!: QuillType
  editorElem!: HTMLElement
  public preserve = false

  private quillSubscription: Subscription | null = null

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
        const sanitize = [true, false].includes(this.sanitize) ? this.sanitize : (this.service.config.sanitize || false)
        if (sanitize) {
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

  ngOnInit() {
    this.preserve = this.preserveWhitespace
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

    // eslint-disable-next-line @typescript-eslint/naming-convention
    this.quillSubscription = this.service.getQuill().subscribe(Quill => {
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

      // The `requestAnimationFrame` triggers change detection. There's no sense to invoke the `requestAnimationFrame` if anyone is
      // listening to the `onEditorCreated` event inside the template, for instance `<quill-view (onEditorCreated)="...">`.
      if (!this.onEditorCreated.observers.length) {
        return
      }

      // The `requestAnimationFrame` will trigger change detection and `onEditorCreated` will also call `markDirty()`
      // internally, since Angular wraps template event listeners into `listener` instruction. We're using the `requestAnimationFrame`
      // to prevent the frame drop and avoid `ExpressionChangedAfterItHasBeenCheckedError` error.
      requestAnimationFrame(() => {
        this.onEditorCreated.emit(this.quillEditor)
      })
    })
  }

  ngOnDestroy(): void {
    this.quillSubscription?.unsubscribe()
    this.quillSubscription = null
  }
}
