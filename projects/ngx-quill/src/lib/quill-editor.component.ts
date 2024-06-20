/* eslint-disable @typescript-eslint/no-explicit-any */
import { DOCUMENT, isPlatformServer } from '@angular/common'
import { DomSanitizer } from '@angular/platform-browser'

import type QuillType from 'quill'
import type { QuillOptions } from 'quill'
import type DeltaType from 'quill-delta'

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  Renderer2,
  SecurityContext,
  signal,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { fromEvent, Subscription } from 'rxjs'
import { debounceTime, mergeMap } from 'rxjs/operators'

import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms'

import { defaultModules, QuillModules, CustomOption, CustomModule } from 'ngx-quill/config'

import { getFormat, raf$ } from './helpers'
import { QuillService } from './quill.service'
import type Toolbar from 'quill/modules/toolbar'
import type History from 'quill/modules/history'

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
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class QuillEditorBase implements AfterViewInit, ControlValueAccessor, OnChanges, OnInit, OnDestroy, Validator {
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
  readonly sanitize = input<boolean | undefined>(false)
  readonly beforeRender = input<() => Promise<void> | undefined>(undefined)
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

  @Output() onEditorCreated: EventEmitter<QuillType> = new EventEmitter()
  @Output() onEditorChanged: EventEmitter<EditorChangeContent | EditorChangeSelection> = new EventEmitter()
  @Output() onContentChanged: EventEmitter<ContentChange> = new EventEmitter()
  @Output() onSelectionChanged: EventEmitter<SelectionChange> = new EventEmitter()
  @Output() onFocus: EventEmitter<Focus> = new EventEmitter()
  @Output() onBlur: EventEmitter<Blur> = new EventEmitter()
  @Output() onNativeFocus: EventEmitter<Focus> = new EventEmitter()
  @Output() onNativeBlur: EventEmitter<Blur> = new EventEmitter()

  quillEditor!: QuillType
  editorElem!: HTMLElement
  content: any
  disabled = false // used to store initial value before ViewInit

  readonly toolbarPosition = signal('top')

  onModelChange: (modelValue?: any) => void
  onModelTouched: () => void
  onValidatorChanged: () => void

  private subscription: Subscription | null = null
  private quillSubscription: Subscription | null = null

  private elementRef = inject(ElementRef)
  private document = inject(DOCUMENT)

  private cd = inject(ChangeDetectorRef)
  private domSanitizer = inject(DomSanitizer)
  private platformId = inject<string>(PLATFORM_ID)
  private renderer = inject(Renderer2)
  private zone = inject(NgZone)
  private service = inject(QuillService)
  private destroyRef = inject(DestroyRef)

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
      } catch (e) {
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
      } catch (e) {
        return [{ insert: value }]
      }
    }

    return value
  })

  ngOnInit() {
    this.toolbarPosition.set(this.customToolbarPosition())
  }

  ngAfterViewInit() {
    if (isPlatformServer(this.platformId)) {
      return
    }

    // The `quill-editor` component might be destroyed before the `quill` chunk is loaded and its code is executed
    // this will lead to runtime exceptions, since the code will be executed on DOM nodes that don't exist within the tree.

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
        bounds = this.service.config.bounds ? this.service.config.bounds : this.document.body
      }

      let debug = this.debug()
      if (!debug && debug !== false && this.service.config.debug) {
        debug = this.service.config.debug
      }

      let readOnly = this.readOnly()
      if (!readOnly && this.readOnly() !== false) {
        readOnly = this.service.config.readOnly !== undefined ? this.service.config.readOnly : false
      }

      let defaultEmptyValue = this.defaultEmptyValue
      // eslint-disable-next-line no-prototype-builtins
      if (this.service.config.hasOwnProperty('defaultEmptyValue')) {
        defaultEmptyValue = this.service.config.defaultEmptyValue
      }

      let formats = this.formats()
      if (!formats && formats === undefined) {
        formats = this.service.config.formats ? [...this.service.config.formats] : (this.service.config.formats === null ? null : undefined)
      }

      this.zone.runOutsideAngular(() => {
        this.quillEditor = new Quill(this.editorElem, {
          bounds,
          debug,
          formats,
          modules,
          placeholder,
          readOnly,
          defaultEmptyValue,
          registry: this.registry(),
          theme: this.theme() || (this.service.config.theme ? this.service.config.theme : 'snow')
        })

        if (this.onNativeBlur.observed) {
          // https://github.com/quilljs/quill/issues/2186#issuecomment-533401328
          this.quillEditor.scroll.domNode.addEventListener('blur', () => this.onNativeBlur.next({
            editor: this.quillEditor,
            source: 'dom'
          }))
          // https://github.com/quilljs/quill/issues/2186#issuecomment-803257538
          const toolbar = this.quillEditor.getModule('toolbar') as Toolbar
          toolbar.container?.addEventListener('mousedown', (e) =>  e.preventDefault())
        }

        if (this.onNativeFocus.observed) {
          this.quillEditor.scroll.domNode.addEventListener('focus', () => this.onNativeFocus.next({
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
      })

      if (this.content) {
        const format = getFormat(this.format(), this.service.config.format)

        if (format === 'text') {
          this.quillEditor.setText(this.content, 'silent')
        } else {
          const valueSetter = this.valueSetter()
          const newValue = valueSetter(this.quillEditor, this.content)
          this.quillEditor.setContents(newValue, 'silent')
        }

        const history  = this.quillEditor.getModule('history') as History
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
  }

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

      this.cd.markForCheck()
    })
  }

  textChangeHandler = (delta: DeltaType, oldDelta: DeltaType, source: string): void => {
    // only emit changes emitted by user interactions
    const text = this.quillEditor.getText()
    const content = this.quillEditor.getContents()

    let html: string | null = this.quillEditor.getSemanticHTML()
    if (this.isEmptyValue(html)) {
      html = this.defaultEmptyValue()
    }

    const trackChanges = this.trackChanges() || this.service.config.trackChanges
    const shouldTriggerOnModelChange = (source === 'user' || trackChanges && trackChanges === 'all') && !!this.onModelChange

    // only emit changes when there's any listener
    if (!this.onContentChanged.observed && !shouldTriggerOnModelChange) {
      return
    }

    this.zone.run(() => {
      if (shouldTriggerOnModelChange) {
        const valueGetter = this.valueGetter()
        this.onModelChange(
          valueGetter(this.quillEditor)
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

      this.cd.markForCheck()
    })
  }

  // eslint-disable-next-line max-len
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

        this.cd.markForCheck()
      })
    } else {
      this.zone.run(() => {
        this.onEditorChanged.emit({
          editor: this.quillEditor,
          event,
          oldRange: old,
          range: current,
          source
        })

        this.cd.markForCheck()
      })
    }
  }

  ngOnDestroy() {
    this.dispose()

    this.quillSubscription?.unsubscribe()
    this.quillSubscription = null
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.quillEditor) {
      return
    }
    /* eslint-disable @typescript-eslint/dot-notation */
    if (changes.readOnly) {
      this.quillEditor.enable(!changes.readOnly.currentValue)
    }
    if (changes.placeholder) {
      this.quillEditor.root.dataset.placeholder =
        changes.placeholder.currentValue
    }
    if (changes.defaultEmptyValue) {
      this.quillEditor.root.dataset.defaultEmptyValue =
        changes.defaultEmptyValue.currentValue
    }
    if (changes.styles) {
      const currentStyling = changes.styles.currentValue
      const previousStyling = changes.styles.previousValue

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
    }
    if (changes.classes) {
      const currentClasses = changes.classes.currentValue
      const previousClasses = changes.classes.previousValue

      if (previousClasses) {
        this.removeClasses(previousClasses)
      }

      if (currentClasses) {
        this.addClasses(currentClasses)
      }
    }
    // We'd want to re-apply event listeners if the `debounceTime` binding changes to apply the
    // `debounceTime` operator or vice-versa remove it.
    if (changes.debounceTime) {
      this.addQuillEventListeners()
    }
    /* eslint-enable @typescript-eslint/dot-notation */
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

    // We have to enter the `<root>` zone when adding event listeners, so `debounceTime` will spawn the
    // `AsyncAction` there w/o triggering change detections. We still re-enter the Angular's zone through
    // `zone.run` when we emit an event to the parent component.
    this.zone.runOutsideAngular(() => {
      this.subscription = new Subscription()

      this.subscription.add(
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

      if (typeof this.debounceTime() === 'number') {
        textChange$ = textChange$.pipe(debounceTime(this.debounceTime()))
        editorChange$ = editorChange$.pipe(debounceTime(this.debounceTime()))
      }

      this.subscription.add(
        // update model if text changes
        textChange$.subscribe(([delta, oldDelta, source]) => {
          this.textChangeHandler(delta as any, oldDelta as any, source)
        })
      )

      this.subscription.add(
        // triggered if selection or text changed
        editorChange$.subscribe(([event, current, old, source]) => {
          this.editorChangeHandler(event as 'text-change' | 'selection-change', current, old, source)
        })
      )
    })
  }

  private dispose(): void {
    if (this.subscription !== null) {
      this.subscription.unsubscribe()
      this.subscription = null
    }
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
  ],
  standalone: true
})
export class QuillEditorComponent extends QuillEditorBase {}
