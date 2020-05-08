import {DOCUMENT, isPlatformServer} from '@angular/common'
import {DomSanitizer} from '@angular/platform-browser'

import {QUILL_CONFIG_TOKEN, QuillConfig, QuillModules, CustomOption, CustomModule} from './quill-editor.interfaces'

import QuillType, { Delta } from 'quill'

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

import {ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator} from '@angular/forms'
import {defaultModules} from './quill-defaults'

import {getFormat} from './helpers'
import { QuillService } from './quill.service'

export interface Range {
  index: number
  length: number
}

export interface ContentChange {
  content: any
  delta: Delta
  editor: QuillType
  html: string | null
  oldDelta: Delta
  source: string
  text: string
}

export interface SelectionChange {
  editor: QuillType
  oldRange: Range | null
  range: Range | null
  source: string
}

export interface Blur {
  editor: QuillType
  source: string
}

export interface Focus {
  editor: QuillType
  source: string
}

export type EditorChangeContent = ContentChange & {event: 'text-change'}
export type EditorChangeSelection = SelectionChange & {event: 'selection-change'}

@Component({
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      useExisting: forwardRef(() => QuillEditorComponent)
    },
    {
      multi: true,
      provide: NG_VALIDATORS,
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      useExisting: forwardRef(() => QuillEditorComponent)
    }
  ],
  selector: 'quill-editor',
  template: `
  <ng-content select="[quill-editor-toolbar]"></ng-content>
`
})
export class QuillEditorComponent implements AfterViewInit, ControlValueAccessor, OnChanges, OnDestroy, Validator {

  quillEditor!: QuillType
  editorElem!: HTMLElement
  content: any

  @Input() format?: 'object' | 'html' | 'text' | 'json'
  @Input() theme?: string
  @Input() modules?: QuillModules
  @Input() debug?: 'warn' | 'log' | 'error' | false
  @Input() readOnly?: boolean
  @Input() placeholder?: string
  @Input() maxLength?: number
  @Input() minLength?: number
  @Input() required = false
  @Input() formats?: string[] | null
  @Input() customToolbarPosition: 'top' | 'bottom' = 'top'
  @Input() sanitize = false
  @Input() styles: any = null
  @Input() strict = true
  @Input() scrollingContainer?: HTMLElement | string | null
  @Input() bounds?: HTMLElement | string
  @Input() customOptions: CustomOption[] = []
  @Input() customModules: CustomModule[] = []
  @Input() trackChanges?: 'user' | 'all'
  @Input() preserveWhitespace = false
  @Input() classes?: string
  @Input() trimOnValidation = false

  @Output() onEditorCreated: EventEmitter<any> = new EventEmitter()
  @Output() onEditorChanged: EventEmitter<EditorChangeContent | EditorChangeSelection> = new EventEmitter()
  @Output() onContentChanged: EventEmitter<ContentChange> = new EventEmitter()
  @Output() onSelectionChanged: EventEmitter<SelectionChange> = new EventEmitter()
  @Output() onFocus: EventEmitter<Focus> = new EventEmitter()
  @Output() onBlur: EventEmitter<Blur> = new EventEmitter()

  disabled = false // used to store initial value before ViewInit

  onModelChange: (modelValue?: any) => void
  onModelTouched: () => void
  onValidatorChanged: () => void

  constructor(
    @Inject(ElementRef) private elementRef: ElementRef,
    @Inject(DomSanitizer) private domSanitizer: DomSanitizer,
    @Inject(DOCUMENT) private doc: any,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(Renderer2) private renderer: Renderer2,
    @Inject(NgZone) private zone: NgZone,
    @Inject(QUILL_CONFIG_TOKEN) private config: QuillConfig,
    @Inject(QuillService) private service: QuillService
  ) {}

  static normalizeClassNames(classes: string): string[] {
    const classList = classes.trim().split(' ')
    return classList.reduce((prev: string[], cur: string) => {
      const trimmed = cur.trim()
      if (trimmed) {
        prev.push(trimmed)
      }

      return prev
    }, [])
  }

  @Input()
  valueGetter = (quillEditor: QuillType, editorElement: HTMLElement): string | any  => {
    let html: string | null = editorElement.querySelector('.ql-editor')!.innerHTML
    if (html === '<p><br></p>' || html === '<div><br></div>') {
      html = null
    }
    let modelValue: string | Delta | null = html
    const format = getFormat(this.format, this.config.format)

    if (format === 'text') {
      modelValue = quillEditor.getText()
    } else if (format === 'object') {
      modelValue = quillEditor.getContents()
    } else if (format === 'json') {
      try {
        modelValue = JSON.stringify(quillEditor.getContents())
      } catch (e) {
        modelValue = quillEditor.getText()
      }
    }

    return modelValue
  }

  @Input()
  valueSetter = (quillEditor: QuillType, value: any): any => {
    const format = getFormat(this.format, this.config.format)
    if (format === 'html') {
      if (this.sanitize) {
        value = this.domSanitizer.sanitize(SecurityContext.HTML, value)
      }
      return quillEditor.clipboard.convert(value)
    } else if (format === 'json') {
      try {
        return JSON.parse(value)
      } catch (e) {
        return [{ insert: value }]
      }
    }

    return value
  }

  async ngAfterViewInit() {
    if (isPlatformServer(this.platformId)) {
      return
    }

    const Quill = await this.service.getQuill()

    this.elementRef.nativeElement.insertAdjacentHTML(
      this.customToolbarPosition === 'top' ? 'beforeend' : 'afterbegin',
      this.preserveWhitespace ? '<pre quill-editor-element></pre>' : '<div quill-editor-element></div>'
    )

    this.editorElem = this.elementRef.nativeElement.querySelector(
      '[quill-editor-element]'
    )

    const toolbarElem = this.elementRef.nativeElement.querySelector(
      '[quill-editor-toolbar]'
    )
    const modules = Object.assign({}, this.modules || (this.config.modules || defaultModules))

    if (toolbarElem) {
      modules.toolbar = toolbarElem
    } else if (modules.toolbar === undefined) {
      modules.toolbar = defaultModules.toolbar
    }

    let placeholder = this.placeholder !== undefined ? this.placeholder : this.config.placeholder
    if (placeholder === undefined) {
      placeholder = 'Insert text here ...'
    }

    if (this.styles) {
      Object.keys(this.styles).forEach((key: string) => {
        this.renderer.setStyle(this.editorElem, key, this.styles[key])
      })
    }

    if (this.classes) {
      this.addClasses(this.classes)
    }

    this.customOptions.forEach((customOption) => {
      const newCustomOption = Quill.import(customOption.import)
      newCustomOption.whitelist = customOption.whitelist
      Quill.register(newCustomOption, true)
    })

    this.customModules.forEach(({implementation, path}) => {
      Quill.register(path, implementation)
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
      formats = this.config.formats ? [...this.config.formats] : (this.config.formats === null ? null : undefined)
    }

    this.zone.runOutsideAngular(() => {
      this.quillEditor = new Quill(this.editorElem, {
        bounds,
        debug: debug as any,
        formats: formats as any,
        modules,
        placeholder,
        readOnly,
        scrollingContainer: scrollingContainer as any,
        strict: this.strict,
        theme: this.theme || (this.config.theme ? this.config.theme : 'snow')
      })
    })

    if (this.content) {
      const format = getFormat(this.format, this.config.format)
      if (format === 'object') {
        this.quillEditor.setContents(this.content, 'silent')
      } else if (format === 'text') {
        this.quillEditor.setText(this.content, 'silent')
      } else if (format === 'json') {
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

      this.quillEditor.getModule('history').clear()
    }

    // initialize disabled status based on this.disabled as default value
    this.setDisabledState()

    // triggered if selection or text changed
    this.quillEditor.on(
      'editor-change',
      this.editorChangeHandler
    )

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

    // trigger created in a timeout to avoid changed models after checked
    // if you are using the editor api in created output to change the editor content
    setTimeout(() => {
      if (this.onValidatorChanged) {
        this.onValidatorChanged()
      }
      this.onEditorCreated.emit(this.quillEditor)
    })
  }

  selectionChangeHandler = (range: Range | null, oldRange: Range | null, source: string) => {
    const shouldTriggerOnModelTouched = !range && !!this.onModelTouched

    // only emit changes when there's any listener
    if (!this.onBlur.observers.length &&
        !this.onFocus.observers.length &&
        !this.onSelectionChanged.observers.length &&
        !shouldTriggerOnModelTouched) {
      return
    }

    this.zone.run(() => {
      if (range === null) {
        this.onBlur.emit({
          editor: this.quillEditor,
          source
        })
      } else if (oldRange === null) {
        this.onFocus.emit({
          editor: this.quillEditor,
          source
        })
      }

      this.onSelectionChanged.emit({
        editor: this.quillEditor,
        oldRange,
        range,
        source
      })

      if (shouldTriggerOnModelTouched) {
        this.onModelTouched()
      }
    })
  }

  textChangeHandler = (delta: Delta, oldDelta: Delta, source: string): void => {
    // only emit changes emitted by user interactions
    const text = this.quillEditor.getText()
    const content = this.quillEditor.getContents()

    let html: string | null = this.editorElem!.querySelector('.ql-editor')!.innerHTML
    if (html === '<p><br></p>' || html === '<div><br></div>') {
      html = null
    }

    const trackChanges = this.trackChanges || this.config.trackChanges
    const shouldTriggerOnModelChange = (source === 'user' || trackChanges && trackChanges === 'all') && !!this.onModelChange

    // only emit changes when there's any listener
    if (!this.onContentChanged.observers.length && !shouldTriggerOnModelChange) {
      return
    }

    this.zone.run(() => {
      if (shouldTriggerOnModelChange) {
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

  // tslint:disable-next-line:max-line-length
  editorChangeHandler = (event: 'text-change' | 'selection-change', current: any | Range | null, old: any | Range | null, source: string): void => {
    // only emit changes when there's any listener
    if (!this.onEditorChanged.observers.length) {
      return
    }

    // only emit changes emitted by user interactions
    if (event === 'text-change') {
      const text = this.quillEditor.getText()
      const content = this.quillEditor.getContents()

      let html: string | null = this.editorElem!.querySelector('.ql-editor')!.innerHTML
      if (html === '<p><br></p>' || html === '<div><br></div>') {
        html = null
      }

      this.zone.run(() => {
        this.onEditorChanged.emit({
          content,
          delta: current,
          editor: this.quillEditor,
          event,
          html,
          oldDelta: old,
          source,
          text
        })
      })
    } else {
      this.onEditorChanged.emit({
        editor: this.quillEditor,
        event,
        oldRange: old,
        range: current,
        source
      })
    }
  }

  ngOnDestroy() {
    if (this.quillEditor) {
      this.quillEditor.off('selection-change', this.selectionChangeHandler)
      this.quillEditor.off('text-change', this.textChangeHandler)
      this.quillEditor.off('editor-change', this.editorChangeHandler)
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
    if (changes['styles']) {
      const currentStyling = changes['styles'].currentValue
      const previousStyling = changes['styles'].previousValue

      if (previousStyling) {
        Object.keys(previousStyling).forEach((key: string) => {
          this.renderer.removeStyle(this.editorElem, key)
        })
      }
      if (currentStyling) {
        Object.keys(currentStyling).forEach((key: string) => {
          this.renderer.setStyle(this.editorElem, key, this.styles[key])
        })
      }
    }
    if (changes['classes']) {
      const currentClasses = changes['classes'].currentValue
      const previousClasses = changes['classes'].previousValue

      if (previousClasses) {
        this.removeClasses(previousClasses)
      }

      if (currentClasses) {
        this.addClasses(currentClasses)
      }
    }
    // tslint:enable:no-string-literal
  }

  addClasses(classList: string): void {
    QuillEditorComponent.normalizeClassNames(classList).forEach((c: string) => {
      this.renderer.addClass(this.editorElem, c)
    })
  }

  removeClasses(classList: string): void {
    QuillEditorComponent.normalizeClassNames(classList).forEach((c: string) => {
      this.renderer.removeClass(this.editorElem, c)
    })
  }

  writeValue(currentValue: any) {
    this.content = currentValue
    const format = getFormat(this.format, this.config.format)

    if (this.quillEditor) {
      if (currentValue) {
        if (format === 'text') {
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

  registerOnValidatorChange(fn: () => void) {
    this.onValidatorChanged = fn
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

    const text = this.quillEditor.getText()
    // trim text if wanted + handle special case that an empty editor contains a new line
    const textLength = this.trimOnValidation ? text.trim().length : (text.length === 1 && text.trim().length === 0 ? 0 : text.length - 1)

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
