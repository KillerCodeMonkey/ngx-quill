import { DOCUMENT, isPlatformServer, CommonModule } from '@angular/common'
import { DomSanitizer } from '@angular/platform-browser'

import QuillType, { Delta } from 'quill'

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Injector,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  Renderer2,
  SecurityContext,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core'
import { fromEvent, Subscription } from 'rxjs'
import { debounceTime, mergeMap } from 'rxjs/operators'

import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms'

import { defaultModules, QuillModules, CustomOption, CustomModule } from 'ngx-quill/config'

import { getFormat } from './helpers'
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
  @Input() format?: 'object' | 'html' | 'text' | 'json'
  @Input() theme?: string
  @Input() modules?: QuillModules
  @Input() debug?: 'warn' | 'log' | 'error' | false
  @Input() readOnly?: boolean
  @Input() placeholder?: string
  @Input() maxLength?: number
  @Input() minLength?: number
  @Input() required = false
  @Input() formats?: string[] | null
  @Input() customToolbarPosition: 'top' | 'bottom' = 'top'
  @Input() sanitize?: boolean
  @Input() beforeRender?: () => Promise<void>
  @Input() styles: any = null
  @Input() strict = true
  @Input() scrollingContainer?: HTMLElement | string | null
  @Input() bounds?: HTMLElement | string
  @Input() customOptions: CustomOption[] = []
  @Input() customModules: CustomModule[] = []
  @Input() trackChanges?: 'user' | 'all'
  @Input() preserveWhitespace = false
  @Input() classes?: string
  @Input() trimOnValidation = false
  @Input() linkPlaceholder?: string
  @Input() compareValues = false
  @Input() filterNull = false
  @Input() debounceTime?: number
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
  @Input() defaultEmptyValue?: any = null

  @Output() onEditorCreated: EventEmitter<any> = new EventEmitter()
  @Output() onEditorChanged: EventEmitter<EditorChangeContent | EditorChangeSelection> = new EventEmitter()
  @Output() onContentChanged: EventEmitter<ContentChange> = new EventEmitter()
  @Output() onSelectionChanged: EventEmitter<SelectionChange> = new EventEmitter()
  @Output() onFocus: EventEmitter<Focus> = new EventEmitter()
  @Output() onBlur: EventEmitter<Blur> = new EventEmitter()

  quillEditor!: QuillType
  editorElem!: HTMLElement
  content: any
  disabled = false // used to store initial value before ViewInit
  preserve = false
  toolbarPosition = 'top'

  onModelChange: (modelValue?: any) => void
  onModelTouched: () => void
  onValidatorChanged: () => void

  private document: Document
  private subscription: Subscription | null = null
  private quillSubscription: Subscription | null = null

  constructor(
    injector: Injector,
    public elementRef: ElementRef,
    protected cd: ChangeDetectorRef,
    protected domSanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) protected platformId: any,
    protected renderer: Renderer2,
    protected zone: NgZone,
    protected service: QuillService
  ) {
    this.document = injector.get(DOCUMENT)
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

  @Input()
  valueGetter = (quillEditor: QuillType, editorElement: HTMLElement): string | any => {
    let html: string | null = editorElement.querySelector('.ql-editor')!.innerHTML
    if (html === '<p><br></p>' || html === '<div><br></div>') {
      html = this.defaultEmptyValue
    }
    let modelValue: string | Delta | null = html
    const format = getFormat(this.format, this.service.config.format)

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
    const format = getFormat(this.format, this.service.config.format)
    if (format === 'html') {
      const sanitize = [true, false].includes(this.sanitize) ? this.sanitize : (this.service.config.sanitize || false)
      if (sanitize) {
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

  ngOnInit() {
    this.preserve = this.preserveWhitespace
    this.toolbarPosition = this.customToolbarPosition
  }

  ngAfterViewInit() {
    if (isPlatformServer(this.platformId)) {
      return
    }

    // The `quill-editor` component might be destroyed before the `quill` chunk is loaded and its code is executed
    // this will lead to runtime exceptions, since the code will be executed on DOM nodes that don't exist within the tree.

    this.quillSubscription = this.service.getQuill().pipe(
      mergeMap((Quill) => {
        const promises = [this.service.registerCustomModules(Quill, this.customModules)]
        const beforeRender = this.beforeRender ?? this.service.config.beforeRender
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
      const modules = Object.assign({}, this.modules || this.service.config.modules)

      if (toolbarElem) {
        modules.toolbar = toolbarElem
      } else if (modules.toolbar === undefined) {
        modules.toolbar = defaultModules.toolbar
      }

      let placeholder = this.placeholder !== undefined ? this.placeholder : this.service.config.placeholder
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

      let bounds = this.bounds && this.bounds === 'self' ? this.editorElem : this.bounds
      if (!bounds) {
        bounds = this.service.config.bounds ? this.service.config.bounds : this.document.body
      }

      let debug = this.debug
      if (!debug && debug !== false && this.service.config.debug) {
        debug = this.service.config.debug
      }

      let readOnly = this.readOnly
      if (!readOnly && this.readOnly !== false) {
        readOnly = this.service.config.readOnly !== undefined ? this.service.config.readOnly : false
      }

      let defaultEmptyValue = this.defaultEmptyValue
      if (this.service.config.hasOwnProperty('defaultEmptyValue')) {
        defaultEmptyValue = this.service.config.defaultEmptyValue
      }

      let scrollingContainer = this.scrollingContainer
      if (!scrollingContainer && this.scrollingContainer !== null) {
        scrollingContainer =
          this.service.config.scrollingContainer === null
            || this.service.config.scrollingContainer ? this.service.config.scrollingContainer : null
      }

      let formats = this.formats
      if (!formats && formats === undefined) {
        formats = this.service.config.formats ? [...this.service.config.formats] : (this.service.config.formats === null ? null : undefined)
      }

      this.zone.runOutsideAngular(() => {
        this.quillEditor = new Quill(this.editorElem, {
          bounds,
          debug: debug as any,
          formats: formats as any,
          modules,
          placeholder,
          readOnly,
          defaultEmptyValue,
          scrollingContainer: scrollingContainer as any,
          strict: this.strict,
          theme: this.theme || (this.service.config.theme ? this.service.config.theme : 'snow')
        })

        // Set optional link placeholder, Quill has no native API for it so using workaround
        if (this.linkPlaceholder) {
          const tooltip = (this.quillEditor as any)?.theme?.tooltip
          const input = tooltip?.root?.querySelector('input[data-link]')
          if (input?.dataset) {
            input.dataset.link = this.linkPlaceholder
          }
        }
      })

      if (this.content) {
        const format = getFormat(this.format, this.service.config.format)

        if (format === 'text') {
          this.quillEditor.setText(this.content, 'silent')
        } else {
          const newValue = this.valueSetter(this.quillEditor, this.content)
          this.quillEditor.setContents(newValue, 'silent')
        }

        this.quillEditor.getModule('history').clear()
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
      requestAnimationFrame(() => {
        if (this.onValidatorChanged) {
          this.onValidatorChanged()
        }
        this.onEditorCreated.emit(this.quillEditor)
      })
    })
  }

  selectionChangeHandler = (range: Range | null, oldRange: Range | null, source: string) => {
    const shouldTriggerOnModelTouched = !range && !!this.onModelTouched

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

  textChangeHandler = (delta: Delta, oldDelta: Delta, source: string): void => {
    // only emit changes emitted by user interactions
    const text = this.quillEditor.getText()
    const content = this.quillEditor.getContents()

    let html: string | null = this.editorElem!.querySelector('.ql-editor')!.innerHTML
    if (html === '<p><br></p>' || html === '<div><br></div>') {
      html = this.defaultEmptyValue
    }

    const trackChanges = this.trackChanges || this.service.config.trackChanges
    const shouldTriggerOnModelChange = (source === 'user' || trackChanges && trackChanges === 'all') && !!this.onModelChange

    // only emit changes when there's any listener
    if (!this.onContentChanged.observed && !shouldTriggerOnModelChange) {
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

      let html: string | null = this.editorElem!.querySelector('.ql-editor')!.innerHTML
      if (html === '<p><br></p>' || html === '<div><br></div>') {
        html = this.defaultEmptyValue
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
          this.renderer.setStyle(this.editorElem, key, this.styles[key])
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
    if (this.filterNull && currentValue === null) {
      return
    }

    this.content = currentValue

    if (!this.quillEditor) {
      return
    }

    const format = getFormat(this.format, this.service.config.format)
    const newValue = this.valueSetter(this.quillEditor, currentValue)

    if (this.compareValues) {
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
    const deltaOperations = this.quillEditor.getContents().ops
    const onlyEmptyOperation = deltaOperations && deltaOperations.length === 1 && ['\n', ''].includes(deltaOperations[0].insert)

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

    if (this.required && !textLength && onlyEmptyOperation) {
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

      if (typeof this.debounceTime === 'number') {
        textChange$ = textChange$.pipe(debounceTime(this.debounceTime))
        editorChange$ = editorChange$.pipe(debounceTime(this.debounceTime))
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
  <ng-container *ngIf="toolbarPosition !== 'top'">
    <div quill-editor-element *ngIf="!preserve"></div>
    <pre quill-editor-element *ngIf="preserve"></pre>
  </ng-container>
  <ng-content select="[quill-editor-toolbar]"></ng-content>
  <ng-container *ngIf="toolbarPosition === 'top'">
    <div quill-editor-element *ngIf="!preserve"></div>
    <pre quill-editor-element *ngIf="preserve"></pre>
  </ng-container>
`,
  styles: [
    `
    :host {
      display: inline-block;
    }
    `
  ],
  standalone: true,
  imports: [CommonModule]
})
export class QuillEditorComponent extends QuillEditorBase {

  constructor(
    injector: Injector,
    @Inject(ElementRef) elementRef: ElementRef,
    @Inject(ChangeDetectorRef) cd: ChangeDetectorRef,
    @Inject(DomSanitizer) domSanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) platformId: any,
    @Inject(Renderer2) renderer: Renderer2,
    @Inject(NgZone) zone: NgZone,
    @Inject(QuillService) service: QuillService
  ) {
    super(
      injector,
      elementRef,
      cd,
      domSanitizer,
      platformId,
      renderer,
      zone,
      service
    )
  }

}
