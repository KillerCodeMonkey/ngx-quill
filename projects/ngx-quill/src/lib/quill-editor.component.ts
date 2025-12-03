import { isPlatformServer } from '@angular/common'
import { DomSanitizer } from '@angular/platform-browser'

import type QuillType from 'quill'
import type { QuillOptions } from 'quill'
import type DeltaType from 'quill-delta'

import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  input,
  Output,
  PLATFORM_ID,
  Renderer2,
  SecurityContext,
  signal,
  ViewEncapsulation
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { debounceTime, fromEvent, Subscription } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms'

import { CustomModule, CustomOption, defaultModules, QuillBeforeRender, QuillFormat, QuillModules } from 'ngx-quill/config'

import type History from 'quill/modules/history'
import type Toolbar from 'quill/modules/toolbar'
import { getFormat } from './helpers'
import { QuillService } from './quill.service'

export interface Range {
  index: number
  length: number
}

export interface ContentChange {
  content: DeltaType
  delta: DeltaType
  editor: QuillType
  html: string | null
  oldDelta: DeltaType
  source: string
  text: string
}

export interface SelectionChange {
  editor: QuillType
  oldRange: Range | null
  range: Range | null
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

export type EditorChangeContent = ContentChange & { event: 'text-change' }
export type EditorChangeSelection = SelectionChange & { event: 'selection-change' }

@Directive()
export abstract class QuillEditorBase implements ControlValueAccessor, Validator {
  readonly format = input<QuillFormat>()
  readonly theme = input<string>()
  readonly modules = input<QuillModules>()
  readonly debug = input<'warn' | 'log' | 'error' | false>(false)
  readonly readOnly = input(false, { transform: booleanAttribute })
  readonly placeholder = input<string>()
  readonly maxLength = input<number>()
  readonly minLength = input<number>()
  readonly required = input(false, { transform: booleanAttribute })
  readonly formats = input<string[] | null>()
  readonly customToolbarPosition = input<'top' | 'bottom'>('top')
  readonly sanitize = input<boolean>()
  readonly beforeRender = input<QuillBeforeRender>()
  readonly styles = input<any>(null)
  readonly registry = input<QuillOptions['registry']>()
  readonly bounds = input<HTMLElement | string>()
  readonly customOptions = input<CustomOption[]>([])
  readonly customModules = input<CustomModule[]>([])
  readonly trackChanges = input<'user' | 'all'>()
  readonly classes = input<string>()
  readonly trimOnValidation = input(false, { transform: booleanAttribute })
  readonly linkPlaceholder = input<string>()
  readonly compareValues = input(false, { transform: booleanAttribute })
  readonly filterNull = input(false, { transform: booleanAttribute })
  readonly debounceTime = input<number>()
  readonly onlyFormatEventData = input<boolean | 'none'>(false)
  /*
  https://github.com/KillerCodeMonkey/ngx-quill/issues/1257 - fix null value set

  provide default empty value
  by default null

  e.g. defaultEmptyValue="" - empty string

  <quill-editor
    defaultEmptyValue=""
    formControlName="message"
  ></quill-editor>
  */
  readonly defaultEmptyValue = input<any>(null)

  @Output() onEditorCreated = new EventEmitter<QuillType>()
  @Output() onEditorChanged = new EventEmitter<EditorChangeContent | EditorChangeSelection>()
  @Output() onContentChanged = new EventEmitter<ContentChange>()
  @Output() onSelectionChanged = new EventEmitter<SelectionChange>()
  @Output() onFocus = new EventEmitter<Focus>()
  @Output() onBlur = new EventEmitter<Blur>()
  @Output() onNativeFocus = new EventEmitter<Focus>()
  @Output() onNativeBlur = new EventEmitter<Blur>()

  quillEditor!: QuillType
  editorElem!: HTMLElement
  content: any
  disabled = false // used to store initial value before ViewInit

  readonly toolbarPosition = signal('top')

  onModelChange: ((modelValue?: any) => void) | undefined
  onModelTouched: (() => void) | undefined
  onValidatorChanged: (() => void) | undefined

  private eventsSubscription: Subscription | null = null
  private quillSubscription: Subscription | null = null

  private elementRef = inject(ElementRef)

  private domSanitizer = inject(DomSanitizer)
  private platformId = inject<string>(PLATFORM_ID)
  private renderer = inject(Renderer2)
  private service = inject(QuillService)
  private destroyRef = inject(DestroyRef)

  private previousStyles: any
  private previousClasses: any

  init = false

  constructor() {
    afterNextRender(() => {
      if (isPlatformServer(this.platformId)) {
        return
      }

      // The `quill-editor` component might be destroyed before the `quill` chunk is loaded and its code is executed
      // this will lead to runtime exceptions, since the code will be executed on DOM nodes that don't exist within the tree.

      this.quillSubscription = this.service.getQuill().pipe(
        mergeMap((Quill) => this.service.beforeRender(Quill, this.customModules(), this.beforeRender()))
      ).subscribe(Quill => {
        this.editorElem = this.elementRef.nativeElement.querySelector(
          '[quill-editor-element]'
        )

        const toolbarElem = this.elementRef.nativeElement.querySelector(
          '[quill-editor-toolbar]'
        )
        const modules = Object.assign({}, this.modules() || this.service.config.modules)

        if (toolbarElem) {
          modules.toolbar = toolbarElem
        } else if (modules.toolbar === undefined) {
          modules.toolbar = defaultModules.toolbar
        }

        let placeholder = this.placeholder() !== undefined ? this.placeholder() : this.service.config.placeholder
        if (placeholder === undefined) {
          placeholder = 'Insert text here ...'
        }

        const styles = this.styles()
        if (styles) {
          this.previousStyles = styles
          Object.keys(styles).forEach((key: string) => {
            this.renderer.setStyle(this.editorElem, key, styles[key])
          })
        }

        const previousClasses = this.classes()
        if (previousClasses) {
          this.previousClasses =previousClasses
          this.addClasses(previousClasses)
        }

        this.customOptions().forEach((customOption) => {
          const newCustomOption = Quill.import(customOption.import)
          newCustomOption.whitelist = customOption.whitelist
          Quill.register(newCustomOption, true)
        })

        let bounds = this.bounds() && this.bounds() === 'self' ? this.editorElem : this.bounds()
        if (!bounds) {
          // Can use global `document` because we execute this only in the browser.
          bounds = this.service.config.bounds ? this.service.config.bounds : document.body
        }

        let debug = this.debug()
        if (!debug && debug !== false && this.service.config.debug) {
          debug = this.service.config.debug
        }

        let readOnly = this.readOnly()
        if (!readOnly && this.readOnly() !== false) {
          readOnly = this.service.config.readOnly !== undefined ? this.service.config.readOnly : false
        }

        let formats = this.formats()
        if (!formats && formats === undefined) {
          formats = this.service.config.formats ? [...this.service.config.formats] : (this.service.config.formats === null ? null : undefined)
        }

        this.quillEditor = new Quill(this.editorElem, {
          bounds,
          debug,
          formats,
          modules,
          placeholder,
          readOnly,
          registry: this.registry(),
          theme: this.theme() || (this.service.config.theme ? this.service.config.theme : 'snow')
        })

        if (this.onNativeBlur.observed) {
          // https://github.com/quilljs/quill/issues/2186#issuecomment-533401328
          fromEvent(this.quillEditor.scroll.domNode, 'blur').pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.onNativeBlur.next({
            editor: this.quillEditor,
            source: 'dom'
          }))
          // https://github.com/quilljs/quill/issues/2186#issuecomment-803257538
          const toolbar = this.quillEditor.getModule('toolbar') as Toolbar
          if (toolbar.container) {
            fromEvent(toolbar.container, 'mousedown').pipe(takeUntilDestroyed(this.destroyRef)).subscribe(e => e.preventDefault())
          }
        }

        if (this.onNativeFocus.observed) {
          fromEvent(this.quillEditor.scroll.domNode, 'focus').pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.onNativeFocus.next({
            editor: this.quillEditor,
            source: 'dom'
          }))
        }

        // Set optional link placeholder, Quill has no native API for it so using workaround
        if (this.linkPlaceholder()) {
          const tooltip = (this.quillEditor as any)?.theme?.tooltip
          const input = tooltip?.root?.querySelector('input[data-link]')
          if (input?.dataset) {
            input.dataset.link = this.linkPlaceholder()
          }
        }

        if (this.content) {
          const format = getFormat(this.format(), this.service.config.format)

          if (format === 'text') {
            this.quillEditor.setText(this.content, 'silent')
          } else {
            const valueSetter = this.valueSetter()
            const newValue = valueSetter(this.quillEditor, this.content)
            this.quillEditor.setContents(newValue, 'silent')
          }

          const history = this.quillEditor.getModule('history') as History
          history.clear()
        }

        // initialize disabled status based on this.disabled as default value
        this.setDisabledState()

        this.addQuillEventListeners()

        // listening to the `onEditorCreated` event inside the template, for instance `<quill-view (onEditorCreated)="...">`.
        if (!this.onEditorCreated.observed && !this.onValidatorChanged) {
          this.init = true
          return
        }

        if (this.onValidatorChanged) {
          this.onValidatorChanged()
        }
        this.onEditorCreated.emit(this.quillEditor)
        this.init = true
      })
    })

    effect(() => {
      const customToolbarPosition = this.customToolbarPosition()
      if (this.init && this.toolbarPosition() !== customToolbarPosition) {
        this.toolbarPosition.set(customToolbarPosition)
      }
    })

    effect(() => {
      const readOnly = this.readOnly()
      if (this.init) {
        if (readOnly) {
          this.quillEditor?.disable()
        } else {
          this.quillEditor?.enable(true)
        }
      }
    })

    effect(() => {
      const placeholder = this.placeholder()
      if (this.init && this.quillEditor) {
         this.quillEditor.root.dataset.placeholder = placeholder
      }
    })

    effect(() => {
      const styles = this.styles()
      if (!this.init || !this.editorElem) {
        return
      }
      const currentStyling = styles
      const previousStyling = this.previousStyles

      if (previousStyling) {
        Object.keys(previousStyling).forEach((key: string) => {
          this.renderer.removeStyle(this.editorElem, key)
        })
      }
      if (currentStyling) {
        Object.keys(currentStyling).forEach((key: string) => {
          this.renderer.setStyle(this.editorElem, key, currentStyling[key])
        })
      }
    })

    effect(() => {
      const classes = this.classes()
      if (!this.init || !this.quillEditor) {
        return
      }
      const currentClasses = classes
      const previousClasses = this.previousClasses

      if (previousClasses) {
        this.removeClasses(previousClasses)
      }

      if (currentClasses) {
        this.addClasses(currentClasses)
      }
    })

    effect(() => {
      const debounceTime = this.debounceTime()
      if (!this.init || !this.quillEditor) {
        return
      }
      if (debounceTime) {
        this.addQuillEventListeners()
      }
    })

    this.destroyRef.onDestroy(() => {
      this.dispose()

      this.quillSubscription?.unsubscribe()
      this.quillSubscription = null
    })
  }

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

  valueGetter = input(this.getter.bind(this))

  valueSetter = input((quillEditor: QuillType, value: any): any => {
    const format = getFormat(this.format(), this.service.config.format)
    if (format === 'html') {
      const sanitize = (typeof this.sanitize() === 'boolean') ? this.sanitize() : (this.service.config.sanitize || false)
      if (sanitize) {
        value = this.domSanitizer.sanitize(SecurityContext.HTML, value)
      }
      return quillEditor.clipboard.convert({ html: value })
    } else if (format === 'json') {
      try {
        return JSON.parse(value)
      } catch {
        return [{ insert: value }]
      }
    }

    return value
  })

  selectionChangeHandler = (range: Range | null, oldRange: Range | null, source: string) => {
    const trackChanges = this.trackChanges() || this.service.config.trackChanges
    const shouldTriggerOnModelTouched = !range && !!this.onModelTouched && (source === 'user' || trackChanges && trackChanges === 'all')

    // only emit changes when there's any listener
    if (!this.onBlur.observed &&
      !this.onFocus.observed &&
      !this.onSelectionChanged.observed &&
      !shouldTriggerOnModelTouched) {
      return
    }

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
      this.onModelTouched!()
    }
  }

  textChangeHandler = (delta: DeltaType, oldDelta: DeltaType, source: string): void => {
    const trackChanges = this.trackChanges() || this.service.config.trackChanges
    const shouldTriggerOnModelChange = (source === 'user' || trackChanges && trackChanges === 'all') && !!this.onModelChange

    // only emit changes when there's any listener
    if (!this.onContentChanged.observed && !shouldTriggerOnModelChange) {
      return
    }

    const data = this.eventCallbackFormats()

    if (shouldTriggerOnModelChange) {
      this.onModelChange!(
        // only call value getter again if not already done in eventCallbackFormats
        data.noFormat ? this.valueGetter()(this.quillEditor) : data[data.format]
      )
    }

    this.onContentChanged.emit({
      content: data.object,
      delta,
      editor: this.quillEditor,
      html: data.html,
      oldDelta,
      source,
      text: data.text
    })
  }

  editorChangeHandler = (
    event: 'text-change' | 'selection-change',
    current: any | Range | null, old: any | Range | null, source: string
  ): void => {
    // only emit changes when there's any listener
    if (!this.onEditorChanged.observed) {
      return
    }

    // only emit changes emitted by user interactions
    if (event === 'text-change') {
      const data = this.eventCallbackFormats()

      this.onEditorChanged.emit({
        content: data.object,
        delta: current,
        editor: this.quillEditor,
        event,
        html: data.html,
        oldDelta: old,
        source,
        text: data.text
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

  addClasses(classList: string): void {
    QuillEditorBase.normalizeClassNames(classList).forEach((c: string) => {
      this.renderer.addClass(this.editorElem, c)
    })
  }

  removeClasses(classList: string): void {
    QuillEditorBase.normalizeClassNames(classList).forEach((c: string) => {
      this.renderer.removeClass(this.editorElem, c)
    })
  }

  writeValue(currentValue: any) {
    // optional fix for https://github.com/angular/angular/issues/14988
    if (this.filterNull() && currentValue === null) {
      return
    }

    this.content = currentValue

    if (!this.quillEditor) {
      return
    }

    const format = getFormat(this.format(), this.service.config.format)
    const valueSetter = this.valueSetter()
    const newValue = valueSetter(this.quillEditor, currentValue)

    if (this.compareValues()) {
      const currentEditorValue = this.quillEditor.getContents()
      if (JSON.stringify(currentEditorValue) === JSON.stringify(newValue)) {
        return
      }
    }

    if (currentValue) {
      if (format === 'text') {
        this.quillEditor.setText(currentValue)
      } else {
        this.quillEditor.setContents(newValue)
      }
      return
    }
    this.quillEditor.setText('')

  }

  setDisabledState(isDisabled: boolean = this.disabled): void {
    // store initial value to set appropriate disabled status after ViewInit
    this.disabled = isDisabled
    if (this.quillEditor) {
      if (isDisabled) {
        this.quillEditor.disable()
        this.renderer.setAttribute(this.elementRef.nativeElement, 'disabled', 'disabled')
      } else {
        if (!this.readOnly()) {
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
    const textLength = this.trimOnValidation() ? text.trim().length : (text.length === 1 && text.trim().length === 0 ? 0 : text.length - 1)
    const deltaOperations = this.quillEditor.getContents().ops
    const onlyEmptyOperation = !!deltaOperations && deltaOperations.length === 1 && ['\n', ''].includes(deltaOperations[0].insert?.toString() || '')

    const minLength = this.minLength()
    if (minLength && textLength && textLength < minLength) {
      err.minLengthError = {
        given: textLength,
        minLength
      }

      valid = false
    }

    const maxLength = this.maxLength()
    if (maxLength && textLength > maxLength) {
      err.maxLengthError = {
        given: textLength,
        maxLength
      }

      valid = false
    }

    if (this.required() && !textLength && onlyEmptyOperation) {
      err.requiredError = {
        empty: true
      }

      valid = false
    }

    return valid ? null : err
  }

  private addQuillEventListeners(): void {
    this.dispose()

    this.eventsSubscription = new Subscription()

    this.eventsSubscription.add(
      // mark model as touched if editor lost focus
      fromEvent(this.quillEditor, 'selection-change').subscribe(
        ([range, oldRange, source]) => {
          this.selectionChangeHandler(range as any, oldRange as any, source)
        }
      )
    )

    // The `fromEvent` supports passing JQuery-style event targets, the editor has `on` and `off` methods which
    // will be invoked upon subscription and teardown.
    let textChange$ = fromEvent(this.quillEditor, 'text-change')
    let editorChange$ = fromEvent(this.quillEditor, 'editor-change')

    const _debounceTime = this.debounceTime()
    if (typeof _debounceTime === 'number') {
      textChange$ = textChange$.pipe(debounceTime(_debounceTime))
      editorChange$ = editorChange$.pipe(debounceTime(_debounceTime))
    }

    this.eventsSubscription.add(
      // update model if text changes
      textChange$.subscribe(([delta, oldDelta, source]) => {
        this.textChangeHandler(delta as any, oldDelta as any, source)
      })
    )

    this.eventsSubscription.add(
      // triggered if selection or text changed
      editorChange$.subscribe(([event, current, old, source]) => {
        this.editorChangeHandler(event as 'text-change' | 'selection-change', current, old, source)
      })
    )
  }

  private dispose(): void {
    this.eventsSubscription?.unsubscribe()
    this.eventsSubscription = null
  }

  private isEmptyValue(html: string | null) {
    return html === '<p></p>' || html === '<div></div>' || html === '<p><br></p>' || html === '<div><br></div>'
  }

  private getter(quillEditor: QuillType, forceFormat?: QuillFormat): string | any {
    let modelValue: string | DeltaType | null = null
    const format = forceFormat ?? getFormat(this.format(), this.service.config.format)

    if (format === 'html') {
      let html: string | null = quillEditor.getSemanticHTML()
      if (this.isEmptyValue(html)) {
        html = this.defaultEmptyValue()
      }
      modelValue = html
    } else if (format === 'text') {
      modelValue = quillEditor.getText()
    } else if (format === 'object') {
      modelValue = quillEditor.getContents()
    } else if (format === 'json') {
      try {
        modelValue = JSON.stringify(quillEditor.getContents())
      } catch {
        modelValue = quillEditor.getText()
      }
    }

    return modelValue
  }

   private eventCallbackFormats() {
    const format = getFormat(this.format(), this.service.config.format)
    const onlyFormat = this.onlyFormatEventData() === true
    const noFormat = this.onlyFormatEventData() === 'none'
    let text: string | null = null
    let html: string | null = null
    let object: DeltaType | null = null
    let json: string | null = null

    // do nothing if no formatted value needed
    if (noFormat) {
      return {
        format,
        onlyFormat,
        noFormat,
        text,
        object,
        json,
        html
      }
    }

    // use getter input to grab value
    const value = this.valueGetter()(this.quillEditor)

    if (format === 'text') {
      text = value
    } else if (format === 'html') {
      html = value
    } else if (format === 'object') {
      object = value
      json = JSON.stringify(value)
    } else if (format === 'json') {
      json = value
      object = JSON.parse(value)
    }

    // return current values, if only the editor format is needed
    if (onlyFormat) {
      return {
        format,
        onlyFormat,
        noFormat,
        text,
        json,
        html,
        object
      }
    }

    // return all format values
    return {
      format,
      onlyFormat,
      noFormat,
      // use internal getter to retrieve correct other values - this.valueGetter can be overwritten
      text: format === 'text' ? text : this.getter(this.quillEditor, 'text'),
      json: format === 'json' ? json : this.getter(this.quillEditor, 'json'),
      html: format === 'html' ? html : this.getter(this.quillEditor, 'html'),
      object: format === 'object' ? object : this.getter(this.quillEditor, 'object')
    }
  }
}

@Component({
  encapsulation: ViewEncapsulation.Emulated,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'quill-editor',
  template: `
    @if (toolbarPosition() !== 'top') {
        <div quill-editor-element></div>
    }

    <ng-content select="[above-quill-editor-toolbar]"></ng-content>
    <ng-content select="[quill-editor-toolbar]"></ng-content>
    <ng-content select="[below-quill-editor-toolbar]"></ng-content>

    @if (toolbarPosition() === 'top') {
        <div quill-editor-element></div>
    }
  `,
  styles: [
    `
    :host {
      display: inline-block;
    }
    `
  ]
})
export class QuillEditorComponent extends QuillEditorBase { }
