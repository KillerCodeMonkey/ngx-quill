import { isPlatformServer } from '@angular/common'
import { DomSanitizer } from '@angular/platform-browser'

import { QUILL_CONFIG_TOKEN, QuillConfig, QuillModules } from './quill-editor.interfaces'

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  PLATFORM_ID,
  Renderer2,
  SecurityContext,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core'

import {
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator
} from '@angular/forms'

import { DOCUMENT } from '@angular/common'
import { defaultModules } from './quill-defaults'

// Because quill uses `document` directly, we cannot `import` during SSR
// instead, we load dynamically via `require('quill')` in `ngAfterViewInit()`
declare var require: any
// tslint:disable-next-line:variable-name
let Quill: any = null

export interface CustomOption {
  import: string
  whitelist: any[]
}

export interface Range {
  index: number
  length: number
}

@Component({
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuillEditorComponent)
    },
    {
      multi: true,
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => QuillEditorComponent)
    }
  ],
  selector: 'quill-editor',
  template: `
  <ng-content select="[quill-editor-toolbar]"></ng-content>
`
})
export class QuillEditorComponent
  implements AfterViewInit, ControlValueAccessor, OnChanges, OnDestroy, Validator {

  quillEditor: any
  editorElem: HTMLElement | undefined
  content: any

  @Input() format?: 'object' | 'html' | 'text' | 'json' = 'html'
  @Input() theme?: string
  @Input() modules?: QuillModules
  @Input() debug?: 'warn' | 'log' | 'error' | false
  @Input() readOnly?: boolean
  @Input() placeholder?: string
  @Input() maxLength?: number
  @Input() minLength?: number
  @Input() required: boolean = false
  @Input() formats?: string[] | null
  @Input() customToolbarPosition: 'top' | 'bottom' = 'top'
  @Input() sanitize: boolean = false
  @Input() style: any = null
  @Input() strict: boolean = true
  @Input() scrollingContainer?: HTMLElement | string | null
  @Input() bounds?: HTMLElement | string
  @Input() customOptions: CustomOption[] = []
  @Input() trackChanges?: 'user' | 'all'

  @Output() onEditorCreated: EventEmitter<any> = new EventEmitter()
  @Output() onContentChanged: EventEmitter<{
    content: any
    delta: any
    editor: any
    html: string | null
    oldDelta: any
    source: string
    text: string
  }> = new EventEmitter()
  @Output() onSelectionChanged: EventEmitter<{
    editor: any
    oldRange: Range | null
    range: Range | null
    source: string
  }> = new EventEmitter()

  private disabled = false // used to store initial value before ViewInit

  constructor(
    private elementRef: ElementRef,
    private domSanitizer: DomSanitizer,
    @Inject(DOCUMENT) private doc: any,
    // tslint:disable-next-line:ban-types
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2,
    private zone: NgZone,
    @Inject(QUILL_CONFIG_TOKEN) private config: QuillConfig
  ) {}

  // tslint:disable-next-line:no-empty
  onModelChange(_modelValue?: any) {}
  // tslint:disable-next-line:no-empty
  onModelTouched() {}

  @Input()
  valueGetter = (quillEditor: any, editorElement: HTMLElement): string | any  => {
    let html: string | null = editorElement.querySelector('.ql-editor')!.innerHTML
    if (html === '<p><br></p>' || html === '<div><br><div>') {
      html = null
    }
    let modelValue = html

    if (this.format === 'text') {
      modelValue = quillEditor.getText()
    } else if (this.format === 'object') {
      modelValue = quillEditor.getContents()
    } else if (this.format === 'json') {
      try {
        modelValue = JSON.stringify(quillEditor.getContents())
      } catch (e) {
        modelValue = quillEditor.getText()
      }
    }

    return modelValue
  }

  @Input()
  valueSetter = (quillEditor: any, value: any): any => {
    if (this.format === 'html') {
      if (this.sanitize) {
        value = this.domSanitizer.sanitize(SecurityContext.HTML, value)
      }
      return quillEditor.clipboard.convert(value)
    } else if (this.format === 'json') {
      try {
        return JSON.parse(value)
      } catch (e) {
        return [{ insert: value }]
      }
    }

    return value
  }

  ngAfterViewInit() {
    if (isPlatformServer(this.platformId)) {
      return
    }
    if (!Quill) {
      Quill = require('quill')
    }

    if (this.customToolbarPosition === 'top') {
      this.elementRef.nativeElement.insertAdjacentHTML(
        'beforeend',
        '<div quill-editor-element></div>'
      )
    } else {
      this.elementRef.nativeElement.insertAdjacentHTML(
        'afterbegin',
        '<div quill-editor-element></div>'
      )
    }
    this.editorElem = this.elementRef.nativeElement.querySelector(
      '[quill-editor-element]'
    )

    const toolbarElem = this.elementRef.nativeElement.querySelector(
      '[quill-editor-toolbar]'
    )
    const modules = this.modules || (this.config.modules || defaultModules)
    if (modules.toolbar === undefined) {
      modules.toolbar = defaultModules.toolbar
    }

    let placeholder = this.placeholder !== undefined ? this.placeholder : this.config.placeholder
    if (placeholder === undefined) {
      placeholder = 'Insert text here ...'
    }

    if (toolbarElem) {
      // tslint:disable-next-line:no-string-literal
      modules['toolbar'] = toolbarElem
    }

    if (this.style) {
      Object.keys(this.style).forEach((key: string) => {
        this.renderer.setStyle(this.editorElem, key, this.style[key])
      })
    }

    this.customOptions.forEach((customOption) => {
      const newCustomOption = Quill.import(customOption.import)
      newCustomOption.whitelist = customOption.whitelist
      Quill.register(newCustomOption, true)
    })

    let bounds = this.bounds && this.bounds === 'self' ? this.editorElem : this.bounds
    if (!bounds) {
      bounds = this.config.bounds ? this.config.bounds : this.doc.body
    }

    let debug = this.debug
    if (!debug && debug !== false && this.config.debug) {
      debug = this.config.debug
    }

    let readOnly = this.readOnly
    if (!readOnly && this.readOnly !== false) {
      readOnly = this.config.readOnly !== undefined ? this.config.readOnly : false
    }

    let scrollingContainer = this.scrollingContainer
    if (!scrollingContainer && this.scrollingContainer !== null) {
      scrollingContainer = this.config.scrollingContainer === null || this.config.scrollingContainer ? this.config.scrollingContainer : null
    }

    let formats = this.formats
    if (!formats && formats === undefined) {
      formats = this.config.formats || this.config.formats === null ? this.config.formats : undefined
    }

    this.quillEditor = new Quill(this.editorElem, {
      bounds,
      debug,
      formats,
      modules,
      placeholder,
      readOnly,
      scrollingContainer,
      strict: this.strict,
      theme: this.theme || (this.config.theme ? this.config.theme : 'snow')
    })

    if (this.content) {
      if (this.format === 'object') {
        this.quillEditor.setContents(this.content, 'silent')
      } else if (this.format === 'text') {
        this.quillEditor.setText(this.content, 'silent')
      } else if (this.format === 'json') {
        try {
          this.quillEditor.setContents(JSON.parse(this.content), 'silent')
        } catch (e) {
          this.quillEditor.setText(this.content, 'silent')
        }
      } else {
        if (this.sanitize) {
          this.content = this.domSanitizer.sanitize(SecurityContext.HTML, this.content)
        }
        const contents = this.quillEditor.clipboard.convert(this.content)
        this.quillEditor.setContents(contents, 'silent')
      }

      this.quillEditor.history.clear()
    }

    // initialize disabled status based on this.disabled as default value
    this.setDisabledState()

    this.onEditorCreated.emit(this.quillEditor)

    // mark model as touched if editor lost focus
    this.quillEditor.on(
      'selection-change',
      this.selectionChangeHandler
    )

    // update model if text changes
    this.quillEditor.on(
      'text-change',
      this.textChangeHandler
    )
  }

  selectionChangeHandler = (range: Range | null, oldRange: Range | null, source: string) => {
    this.zone.run(() => {
      this.onSelectionChanged.emit({
        editor: this.quillEditor,
        oldRange,
        range,
        source
      })

      if (!range && this.onModelTouched) {
        this.onModelTouched()
      }
    })
  }

  textChangeHandler = (delta: any, oldDelta: any, source: string): void => {
    // only emit changes emitted by user interactions

    const text = this.quillEditor.getText()
    const content = this.quillEditor.getContents()

    let html: string | null = this.editorElem!.querySelector('.ql-editor')!.innerHTML
    if (html === '<p><br></p>' || html === '<div><br><div>') {
      html = null
    }

    this.zone.run(() => {
      const trackChanges = this.trackChanges || this.config.trackChanges
      if ((source === Quill.sources.USER || trackChanges && trackChanges === 'all') && this.onModelChange) {
        this.onModelChange(
          this.valueGetter(this.quillEditor, this.editorElem!)
        )
      }

      this.onContentChanged.emit({
        content,
        delta,
        editor: this.quillEditor,
        html,
        oldDelta,
        source,
        text
      })
    })
  }

  ngOnDestroy() {
    if (this.quillEditor) {
      this.quillEditor.off('selection-change', this.selectionChangeHandler)
      this.quillEditor.off('text-change', this.textChangeHandler)
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.quillEditor) {
      return
    }
    // tslint:disable:no-string-literal
    if (changes['readOnly']) {
      this.quillEditor.enable(!changes['readOnly'].currentValue)
    }
    if (changes['placeholder']) {
      this.quillEditor.root.dataset.placeholder =
        changes['placeholder'].currentValue
    }
    if (changes['style']) {
      const currentStyling = changes['style'].currentValue
      const previousStyling = changes['style'].previousValue

      if (previousStyling) {
        Object.keys(previousStyling).forEach((key: string) => {
          this.renderer.removeStyle(this.editorElem, key)
        })
      }
      if (currentStyling) {
        Object.keys(currentStyling).forEach((key: string) => {
          this.renderer.setStyle(this.editorElem, key, this.style[key])
        })
      }
    }
    // tslint:enable:no-string-literal
  }

  writeValue(currentValue: any) {
    this.content = currentValue

    if (this.quillEditor) {
      if (currentValue) {
        if (this.format === 'text') {
          this.quillEditor.setText(currentValue)
        } else {
          this.quillEditor.setContents(
            this.valueSetter(this.quillEditor, this.content)
          )
        }
        return
      }
      this.quillEditor.setText('')
    }
  }

  setDisabledState(isDisabled: boolean = this.disabled): void {
    // store initial value to set appropriate disabled status after ViewInit
    this.disabled = isDisabled
    if (this.quillEditor) {
      if (isDisabled) {
        this.quillEditor.disable()
        this.renderer.setAttribute(this.elementRef.nativeElement, 'disabled', 'disabled')
      } else {
        if (!this.readOnly) {
          this.quillEditor.enable()
        }
        this.renderer.removeAttribute(this.elementRef.nativeElement, 'disabled')
      }
    }
  }

  registerOnChange(fn: (modelValue: any) => void): void {
    this.onModelChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onModelTouched = fn
  }

  validate() {
    if (!this.quillEditor) {
      return null
    }

    const err: {
      minLengthError?: {
        given: number
        minLength: number
      }
      maxLengthError?: {
        given: number
        maxLength: number
      }
      requiredError?: { empty: boolean }
    } = {}
    let valid = true

    const textLength = this.quillEditor.getText().trim().length

    if (this.minLength && textLength && textLength < this.minLength) {
      err.minLengthError = {
        given: textLength,
        minLength: this.minLength
      }

      valid = false
    }

    if (this.maxLength && textLength > this.maxLength) {
      err.maxLengthError = {
        given: textLength,
        maxLength: this.maxLength
      }

      valid = false
    }

    if (this.required && !textLength) {
      err.requiredError = {
        empty: true
      }

      valid = false
    }

    return valid ? null : err
  }
}
