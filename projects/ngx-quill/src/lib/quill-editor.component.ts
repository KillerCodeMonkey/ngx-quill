import { isPlatformServer } from '@angular/common'
import { DomSanitizer } from '@angular/platform-browser'

import type QuillType from 'quill'
import type { QuillOptions } from 'quill'
import type DeltaType from 'quill-delta'

import {
  afterNextRender,
  Component,
  DestroyRef,
  Directive,
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
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import { fromEvent, Subscription } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms'

import { CustomModule, CustomOption, defaultModules, QuillBeforeRender, QuillModules } from 'ngx-quill/config'

import type History from 'quill/modules/history'
import type Toolbar from 'quill/modules/toolbar'
import { getFormat, raf$ } from './helpers'
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
  readonly format = input<'object' | 'html' | 'text' | 'json' | undefined>(
    undefined
  )
  readonly theme = input<string | undefined>(undefined)
  readonly modules = input<QuillModules | undefined>(undefined)
  readonly debug = input<'warn' | 'log' | 'error' | false>(false)
  readonly readOnly = input<boolean | undefined>(false)
  readonly placeholder = input<string | undefined>(undefined)
  readonly maxLength = input<number | undefined>(undefined)
  readonly minLength = input<number | undefined>(undefined)
  readonly required = input(false)
  readonly formats = input<string[] | null | undefined>(undefined)
  readonly customToolbarPosition = input<'top' | 'bottom'>('top')
  readonly sanitize = input<boolean | undefined>(undefined)
  readonly beforeRender = input<QuillBeforeRender>(undefined)
  readonly styles = input<any>(null)
  readonly registry = input<QuillOptions['registry']>(
    undefined
  )
  readonly bounds = input<HTMLElement | string | undefined>(undefined)
  readonly customOptions = input<CustomOption[]>([])
  readonly customModules = input<CustomModule[]>([])
  readonly trackChanges = input<'user' | 'all' | undefined>(undefined)
  readonly classes = input<string | undefined>(undefined)
  readonly trimOnValidation = input(false)
  readonly linkPlaceholder = input<string | undefined>(undefined)
  readonly compareValues = input(false)
  readonly filterNull = input(false)
  readonly debounceTime = input<number | undefined>(undefined)
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

  onModelChange: (modelValue?: any) => void
  onModelTouched: () => void
  onValidatorChanged: () => void

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

  constructor() {
    toObservable(this.customToolbarPosition).subscribe((customToolbarPosition) => {
      if (this.toolbarPosition() !== customToolbarPosition) {
        this.toolbarPosition.set(customToolbarPosition)
      }
    })
    toObservable(this.readOnly).subscribe((readOnly) => this.quillEditor?.enable(readOnly))
    toObservable(this.placeholder).subscribe((placeholder) => { if (this.quillEditor) this.quillEditor.root.dataset.placeholder = placeholder })
    toObservable(this.styles).subscribe((styles) => {
      const currentStyling = styles
      const previousStyling = this.previousStyles

      if (previousStyling) {
        Object.keys(previousStyling).forEach((key: string) => {
          this.renderer.removeStyle(this.editorElem, key)
        })
      }
      if (currentStyling) {
        Object.keys(currentStyling).forEach((key: string) => {
          this.renderer.setStyle(this.editorElem, key, this.styles()[key])
        })
      }
    })
    toObservable(this.classes).subscribe((classes) => {
      const currentClasses = classes
      const previousClasses = this.previousClasses

      if (previousClasses) {
        this.removeClasses(previousClasses)
      }

      if (currentClasses) {
        this.addClasses(currentClasses)
      }
    })
    toObservable(this.debounceTime).subscribe((debounceTime) => {
      if (!this.quillEditor) {
        return this.quillEditor
      }
      if (debounceTime) {
        this.addQuillEventListeners()
      }
    })

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
          Object.keys(styles).forEach((key: string) => {
            this.renderer.setStyle(this.editorElem, key, styles[key])
          })
        }

        if (this.classes()) {
          this.addClasses(this.classes())
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

        // The `requestAnimationFrame` triggers change detection. There's no sense to invoke the `requestAnimationFrame` if anyone is
        // listening to the `onEditorCreated` event inside the template, for instance `<quill-view (onEditorCreated)="...">`.
        if (!this.onEditorCreated.observed && !this.onValidatorChanged) {
          return
        }

        // The `requestAnimationFrame` will trigger change detection and `onEditorCreated` will also call `markDirty()`
        // internally, since Angular wraps template event listeners into `listener` instruction. We're using the `requestAnimationFrame`
        // to prevent the frame drop and avoid `ExpressionChangedAfterItHasBeenCheckedError` error.
        raf$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
          if (this.onValidatorChanged) {
            this.onValidatorChanged()
          }
          this.onEditorCreated.emit(this.quillEditor)
        })
      })
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

  valueGetter = input((quillEditor: QuillType): string | any => {
    let html: string | null = quillEditor.getSemanticHTML()
    if (this.isEmptyValue(html)) {
      html = this.defaultEmptyValue()
    }
    let modelValue: string | DeltaType | null = html
    const format = getFormat(this.format(), this.service.config.format)

    if (format === 'text') {
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
  })

  valueSetter = input((quillEditor: QuillType, value: any): any => {
    const format = getFormat(this.format(), this.service.config.format)
    if (format === 'html') {
      const sanitize = [true, false].includes(this.sanitize()) ? this.sanitize() : (this.service.config.sanitize || false)
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
      this.onModelTouched()
    }
  }

  textChangeHandler = (delta: DeltaType, oldDelta: DeltaType, source: string): void => {
    const trackChanges = this.trackChanges() || this.service.config.trackChanges
    const shouldTriggerOnModelChange = (source === 'user' || trackChanges && trackChanges === 'all') && !!this.onModelChange

    // only emit changes when there's any listener
    if (!this.onContentChanged.observed && !shouldTriggerOnModelChange) {
      return
    }

    // only emit changes emitted by user interactions
    const valueGetterValue = this.valueGetter()(this.quillEditor)
    const format = getFormat(this.format(), this.service.config.format)

    const text = this.quillEditor.getText()
    const content = this.quillEditor.getContents()

    // perf do not get html twice -> it is super slow
    let html: string | null = format === 'html' ? valueGetterValue : this.quillEditor.getSemanticHTML()
    if (this.isEmptyValue(html)) {
      html = this.defaultEmptyValue()
    }

    if (shouldTriggerOnModelChange) {
      this.onModelChange(
        valueGetterValue
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
      const text = this.quillEditor.getText()
      const content = this.quillEditor.getContents()

      let html: string | null = this.quillEditor.getSemanticHTML()
      if (this.isEmptyValue(html)) {
        html = this.defaultEmptyValue()
      }

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
    const onlyEmptyOperation = !!deltaOperations && deltaOperations.length === 1 && ['\n', ''].includes(deltaOperations[0].insert?.toString())

    if (this.minLength() && textLength && textLength < this.minLength()) {
      err.minLengthError = {
        given: textLength,
        minLength: this.minLength()
      }

      valid = false
    }

    if (this.maxLength() && textLength > this.maxLength()) {
      err.maxLengthError = {
        given: textLength,
        maxLength: this.maxLength()
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
  }

  private dispose(): void {
    this.eventsSubscription?.unsubscribe()
    this.eventsSubscription = null
  }

  private isEmptyValue(html: string | null) {
    return html === '<p></p>' || html === '<div></div>' || html === '<p><br></p>' || html === '<div><br></div>'
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
