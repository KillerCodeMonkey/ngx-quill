import { isPlatformServer, } from '@angular/common'
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
  inject,
  input,
  model,
  Output,
  PLATFORM_ID,
  Renderer2,
  SecurityContext,
  signal,
  ViewEncapsulation
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormValueControl, ValidationResult } from '@angular/forms/signals'
import { DomSanitizer } from '@angular/platform-browser'
import { CustomModule, CustomOption, defaultModules, QuillBeforeRender, QuillFormat, QuillModules } from 'ngx-quill/config'
import type QuillType from 'quill'
import type { QuillOptions } from 'quill'
import type DeltaType from 'quill-delta'
import type History from 'quill/modules/history'
import type Toolbar from 'quill/modules/toolbar'
import { debounceTime, fromEvent, mergeMap, Subscription } from 'rxjs'

import { type Blur, type ContentChange, type EditorChangeContent, type EditorChangeSelection, type Focus, type Range, type SelectionChange } from './quill-editor.component'
import { QuillService } from './quill.service'

export enum ValidationKind {
  quillMinLength = 'quillMinLength',
  quillMaxLength = 'quillMaxLength',
  quillRequired = 'quillRequired'
}
export const getFormat = (format?: QuillFormat, configFormat?: QuillFormat): QuillFormat => {
  const passedFormat = format || configFormat
  return passedFormat || 'html'
}

@Directive()
export abstract class QuillEditorFieldBase implements FormValueControl<string | DeltaType | null> {

  // Required
  readonly value = model<string | DeltaType | null>(null)

  // Writable interaction state - control updates these
  readonly touched = model<boolean>(false)

  // Read-only state - form system manages these
  readonly disabled = input(false, { transform: booleanAttribute })
  readonly readonly = input(false, { transform: booleanAttribute })

  // Custom component inputs
  readonly format = input<QuillFormat>()
  readonly theme = input<string>()
  readonly modules = input<QuillModules>()
  readonly debug = input<'warn' | 'log' | 'error' | false>(false)
  readonly placeholder = input<string>()
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

  /* ---------------- DEPENDENCIES ---------------- */

  protected quillService = inject(QuillService)
  private elementRef = inject(ElementRef)
  private domSanitizer = inject(DomSanitizer)
  private platformId = inject<string>(PLATFORM_ID)
  private renderer = inject(Renderer2)
  private service = inject(QuillService)
  private destroyRef = inject(DestroyRef)

  protected quill!: QuillType
  private previousStyles: any
  private previousClasses: any
  private internalChange = false

  private eventsSubscription: Subscription | null = null
  private quillSubscription: Subscription | null = null

  readonly quillEditor = signal<QuillType | null>(null)
  editorElem!: HTMLElement

  @Output() onEditorCreated = new EventEmitter<QuillType>()
  @Output() onEditorChanged = new EventEmitter<EditorChangeContent | EditorChangeSelection>()
  @Output() onContentChanged = new EventEmitter<ContentChange>()
  @Output() onSelectionChanged = new EventEmitter<SelectionChange>()
  @Output() onFocus = new EventEmitter<Focus>()
  @Output() onBlur = new EventEmitter<Blur>()
  @Output() onNativeFocus = new EventEmitter<Focus>()
  @Output() onNativeBlur = new EventEmitter<Blur>()

  readonly toolbarPosition = signal('top')

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

        let readOnly = this.readonly()
        if (!readOnly && readOnly !== false) {
          readOnly = this.service.config.readOnly !== undefined ? this.service.config.readOnly : false
        }

        let formats = this.formats()
        if (!formats && formats === undefined) {
          formats = this.service.config.formats ? [...this.service.config.formats] : (this.service.config.formats === null ? null : undefined)
        }

        const editor = new Quill(this.editorElem, {
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
          fromEvent(editor.scroll.domNode, 'blur').pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.onNativeBlur.next({
            editor,
            source: 'dom'
          }))
          // https://github.com/quilljs/quill/issues/2186#issuecomment-803257538
          const toolbar = editor.getModule('toolbar') as Toolbar
          if (toolbar.container) {
            fromEvent(toolbar.container, 'mousedown').pipe(takeUntilDestroyed(this.destroyRef)).subscribe(e => e.preventDefault())
          }
        }

        if (this.onNativeFocus.observed) {
          fromEvent(editor.scroll.domNode, 'focus').pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.onNativeFocus.next({
            editor,
            source: 'dom'
          }))
        }

        // Set optional link placeholder, Quill has no native API for it so using workaround
        if (this.linkPlaceholder()) {
          const tooltip = (editor as any)?.theme?.tooltip
          const input = tooltip?.root?.querySelector('input[data-link]')
          if (input?.dataset) {
            input.dataset.link = this.linkPlaceholder()
          }
        }
        const value = this.value()

        if (value) {
          this.internalChange = true
          const format = getFormat(this.format(), this.service.config.format)

          if (format === 'text') {
            editor.setText(value as string, 'silent')
          } else {
            const valueSetter = this.valueSetter()
            const newValue = valueSetter(editor, value)
            editor.setContents(newValue, 'silent')
          }

          const history = editor.getModule('history') as History
          history.clear()

          // trigger initial form validation
          this.value.set(value)
        }

        // should trigger effects when editor set, setting init disabled, readonly + adds event listeners
        this.quillEditor.set(editor)

        // listening to the `onEditorCreated` event inside the template, for instance `<quill-view (onEditorCreated)="...">`.
        if (this.onEditorCreated.observed) {
          this.onEditorCreated.emit(editor)
        }
      })
    })

    effect(() => {
      const editor = this.quillEditor()
      const customToolbarPosition = this.customToolbarPosition()
      if (editor && this.toolbarPosition() !== customToolbarPosition) {
        this.toolbarPosition.set(customToolbarPosition)
      }
    })

    effect(() => {
      const readonly = this.readonly()
      const editor = this.quillEditor()
      if (!editor) {
        return
      }
      if (readonly) {
        editor.disable()
      } else {
        editor.enable(true)
      }
    })

    effect(() => {
      let placeholder = this.placeholder()
      const editor = this.quillEditor()
      if (!editor) {
        return
      }
      placeholder = placeholder !== undefined ? placeholder : this.service.config.placeholder
      if (placeholder === undefined) {
        placeholder = 'Insert text here ...'
      }
      editor.root.dataset['placeholder'] = placeholder
    })

    effect(() => {
      const styles = this.styles()
      const editor = this.quillEditor()
      if (!this.editorElem || !editor) {
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
      const editor = this.quillEditor()
      if (!editor) {
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
      const editor = this.quillEditor()
      if (!editor) {
        return
      }
      this.addQuillEventListeners(debounceTime)
    })

    effect(() => {
      const disabled = this.disabled()
      const editor = this.quillEditor()
      if (!editor) {
        return
      }
      this.setDisabledState(disabled)
    })

    effect(() => {
      const value = this.value()
      const editor = this.quillEditor()
      if (!editor) {
        return
      }
      if (this.internalChange) {
        this.internalChange = false
        return
      }
      this.writeValue(value)
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

  valueSetter = input((quillEditor: QuillType, value: string | DeltaType | null): any => {
    const format = getFormat(this.format(), this.service.config.format)
    if (format === 'html') {
      const sanitize = (typeof this.sanitize() === 'boolean') ? this.sanitize() : (this.service.config.sanitize || false)
      if (sanitize) {
        value = this.domSanitizer.sanitize(SecurityContext.HTML, value)
      }
      return quillEditor.clipboard.convert({ html: value as string })
    }

    if (format === 'json') {
      try {
        return JSON.parse(value as string) as DeltaType
      } catch {
        return [{ insert: value } as unknown as DeltaType]
      }
    }

    return value as DeltaType
  })

  selectionChangeHandler = (range: Range | null, oldRange: Range | null, source: string) => {
    const trackChanges = this.trackChanges() || this.service.config.trackChanges
    const shouldTriggerOnModelTouched = !range && (source === 'user' || trackChanges && trackChanges === 'all')
    const editor = this.quillEditor()
    if (!editor) {
      return
    }

    // only emit changes when there's any listener
    if (!this.onBlur.observed &&
      !this.onFocus.observed &&
      !this.onSelectionChanged.observed &&
      !shouldTriggerOnModelTouched) {
      return
    }

    if (range === null) {
      this.onBlur.emit({
        editor,
        source
      })
    } else if (oldRange === null) {
      this.onFocus.emit({
        editor,
        source
      })
    }

    this.onSelectionChanged.emit({
      editor,
      oldRange,
      range,
      source
    })

    if (shouldTriggerOnModelTouched) {
      this.touched.set(true)
    }
  }

  textChangeHandler = (delta: DeltaType, oldDelta: DeltaType, source: string): void => {
    const trackChanges = this.trackChanges() || this.service.config.trackChanges
    const shouldTriggerOnModelChange = (source === 'user' || trackChanges && trackChanges === 'all')
    const editor = this.quillEditor()
    if (!editor) {
      return
    }

    // only emit changes when there's any listener
    if (!this.onContentChanged.observed && !shouldTriggerOnModelChange) {
      return
    }

    const data = this.eventCallbackFormats()

    if (shouldTriggerOnModelChange) {
      // do not trigger value set again
      this.internalChange = true
      this.value.set(
        // only call value getter again if not already done in eventCallbackFormats
        data.noFormat ? this.valueGetter()(editor) : data[data.format]
      )
    }

    if (this.onContentChanged.observed) {
      this.onContentChanged.emit({
        content: data.object,
        delta,
        editor,
        html: data.html,
        oldDelta,
        source,
        text: data.text
      })
    }
  }

  editorChangeHandler = (
    event: 'text-change' | 'selection-change',
    current: any | Range | null, old: any | Range | null, source: string
  ): void => {
    const editor = this.quillEditor()
    if (!editor) {
      return
    }
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
        editor,
        event,
        html: data.html,
        oldDelta: old,
        source,
        text: data.text
      })
    } else {
      this.onEditorChanged.emit({
        editor,
        event,
        oldRange: old,
        range: current,
        source
      })
    }
  }

  addClasses(classList: string): void {
    QuillEditorFieldBase.normalizeClassNames(classList).forEach((c: string) => {
      this.renderer.addClass(this.editorElem, c)
    })
  }

  removeClasses(classList: string): void {
    QuillEditorFieldBase.normalizeClassNames(classList).forEach((c: string) => {
      this.renderer.removeClass(this.editorElem, c)
    })
  }

  writeValue(currentValue: string | DeltaType | null) {
    const editor = this.quillEditor()
    // optional fix for https://github.com/angular/angular/issues/14988
    if (this.filterNull() && currentValue === null) {
      return
    }
    if (!editor) {
      return
    }

    const format = getFormat(this.format(), this.service.config.format)
    const valueSetter = this.valueSetter()
    const newValue = valueSetter(editor, currentValue)

    if (this.compareValues()) {
      const currentEditorValue = editor.getContents()

      if (!currentEditorValue.diff(newValue).changeLength()) {
        return
      }
    }

    if (currentValue) {
      if (format === 'text') {
        editor.setText(currentValue as string)
      } else {
        editor.setContents(newValue)
      }
      return
    }

    editor.setText('')
  }

  setDisabledState(isDisabled: boolean): void {
    const editor = this.quillEditor()
    if (!editor) {
      return
    }

    if (isDisabled) {
      editor.disable()
      this.renderer.setAttribute(this.elementRef.nativeElement, 'disabled', 'disabled')
    } else {
      if (!this.readonly()) {
        editor.enable()
      }
      this.renderer.removeAttribute(this.elementRef.nativeElement, 'disabled')
    }
  }

  validate({
    required = false,
    minLength,
    maxLength
  }: {
    required?: boolean
    minLength?: number
    maxLength?: number
  }): ValidationResult<{
    kind: ValidationKind
    message?: string
  }> | null {
    const editor = this.quillEditor()
    if (!editor || (!required && !minLength && !maxLength)) {
      return null
    }

    const text = editor.getText()
    // trim text if wanted + handle special case that an empty editor contains a new line
    const textLength = this.trimOnValidation() ? text.trim().length : (text.length === 1 && text.trim().length === 0 ? 0 : text.length - 1)
    const deltaOperations = editor.getContents().ops
    const onlyEmptyOperation = !!deltaOperations && deltaOperations.length === 1 && ['\n', ''].includes(deltaOperations[0].insert?.toString() || '')
    const errors:{
      kind: ValidationKind
      message?: string
    }[]  = []

    if (minLength && textLength && textLength < minLength) {
      errors.push({
        kind: ValidationKind.quillMinLength,
        message: `text length: ${textLength}, min length: ${minLength}`
      })
    }

    if (maxLength && textLength > maxLength) {
      errors.push({
        kind: ValidationKind.quillMaxLength,
        message: `text length: ${textLength}, min length: ${maxLength}`
      })
    }

    if (required && !textLength && onlyEmptyOperation) {
      errors.push({
        kind: ValidationKind.quillRequired,
        message: `text length: ${textLength}`,
      })
    }

    return errors.length ? errors :  null
  }

  focus() {
    const editor = this.quillEditor()
    if (!editor) {
      return
    }

    editor.focus()
  }

  private addQuillEventListeners(dbt?: number | null): void {
    this.dispose()
    const editor = this.quillEditor()
    if (!editor) {
      return
    }

    this.eventsSubscription = new Subscription()

    this.eventsSubscription.add(
      // mark model as touched if editor lost focus
      fromEvent(editor, 'selection-change').subscribe(
        ([range, oldRange, source]) => {
          this.selectionChangeHandler(range as any, oldRange as any, source)
        }
      )
    )

    // The `fromEvent` supports passing JQuery-style event targets, the editor has `on` and `off` methods which
    // will be invoked upon subscription and teardown.
    let textChange$ = fromEvent(editor, 'text-change')
    let editorChange$ = fromEvent(editor, 'editor-change')

    if (typeof dbt === 'number') {
      textChange$ = textChange$.pipe(debounceTime(dbt))
      editorChange$ = editorChange$.pipe(debounceTime(dbt))
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
    const editor = this.quillEditor()

    // do nothing if no formatted value needed
    if (noFormat || !editor) {
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
    const value = this.valueGetter()(editor)

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
      text: format === 'text' ? text : this.getter(editor, 'text'),
      json: format === 'json' ? json : this.getter(editor, 'json'),
      html: format === 'html' ? html : this.getter(editor, 'html'),
      object: format === 'object' ? object : this.getter(editor, 'object')
    }
  }
}

@Component({
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'quill-editor-field',
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
export class QuillEditorFieldComponent extends QuillEditorFieldBase { }

