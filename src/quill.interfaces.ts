type Sources = 'api' | 'user' | 'silent'

interface AttributeMap {
  [key: string]: any
  compose(a: AttributeMap | undefined, b: AttributeMap | undefined, keepNull: boolean): AttributeMap | undefined
  diff(a?: AttributeMap, b?: AttributeMap): AttributeMap | undefined
  invert(attr?: AttributeMap, base?: AttributeMap): AttributeMap
  transform(a: AttributeMap | undefined, b: AttributeMap | undefined, priority?: boolean): AttributeMap | undefined
}

interface Op {
  insert?: string | object
  delete?: number
  retain?: number
  attributes?: AttributeMap
  iterator(ops: Op[]): Iterator
  length(op: Op): number
}

interface Iterator {
  ops: Op[]
  index: number
  offset: number
  hasNext(): boolean
  next(length?: number): Op
  peek(): Op
  peekLength(): number
  peekType(): string
  rest(): Op[]
}

export interface QuillDelta {
  ops: Op[]
  insert(arg: string | object, attributes?: AttributeMap): this
  delete(length: number): this
  retain(length: number, attributes?: AttributeMap): this
  push(newOp: Op): this
  chop(): this
  filter(predicate: (op: Op, index: number) => boolean): Op[]
  forEach(predicate: (op: Op, index: number) => void): void
  map<T>(predicate: (op: Op, index: number) => T): T[]
  partition(predicate: (op: Op) => boolean): [Op[], Op[]]
  reduce<T>(predicate: (accum: T, curr: Op, index: number) => T, initialValue: T): T
  changeLength(): number
  length(): number
  slice(start?: number, end?: number): QuillDelta
  compose(other: QuillDelta): QuillDelta
  concat(other: QuillDelta): QuillDelta
  diff(other: QuillDelta, cursor?: number | CursorInfo): QuillDelta
  eachLine(predicate: (line: QuillDelta, attributes: AttributeMap, index: number) => boolean | void, newline?: string): void
  invert(base: QuillDelta): QuillDelta
  transform(index: number, priority?: boolean): number
  transform(other: QuillDelta, priority?: boolean): QuillDelta
  transformPosition(index: number, priority?: boolean): number
}

interface CursorInfo {
  oldRange: { index: number, length: number }
  newRange: { index: number, length: number }
}

interface Key {
  key: string | number
  shortKey?: boolean
  shiftKey?: boolean
}

interface StringMap {
  [key: string]: any
}

export type TextChangeHandler = (delta: QuillDelta, oldContents: QuillDelta, source: Sources) => any
export type SelectionChangeHandler = (range: RangeStatic, oldRange: RangeStatic, source: Sources) => any
export type EditorChangeHandler = ((name: "text-change", delta: QuillDelta, oldContents: QuillDelta, source: Sources) => any)
| ((name: "selection-change", range: RangeStatic, oldRange: RangeStatic, source: Sources) => any)

interface KeyboardStatic {
  bindings: any
  listen(): void
  addBinding(key: Key, callback: (range: RangeStatic, context: any) => void): void
  addBinding(key: Key, context: any, callback: (range: RangeStatic, context: any) => void): void
}

type Matcher = (node: any, delta: QuillDelta) => QuillDelta
type Selector = string | number

interface ClipboardStatic {
  container: any
  matchers: Array<[Selector, Matcher]>
  convert(html?: string): QuillDelta
  onPaste(event: ClipboardEvent): void
  prepareMatching(): void
  addMatcher(selectorOrNodeType: Selector, callback: Matcher): void
  dangerouslyPasteHTML(html: string, source?: Sources): void
  dangerouslyPasteHTML(index: number, html: string, source?: Sources): void
}

interface BoundsStatic {
  bottom: number
  left: number
  right: number
  top: number
  height: number
  width: number
}

interface RangeStatic {
  index: number
  length: number
}

interface EventEmitter {
  on(eventName: "text-change", handler: TextChangeHandler): EventEmitter
  on(eventName: "selection-change", handler: SelectionChangeHandler): EventEmitter
  on(eventName: "editor-change", handler: EditorChangeHandler): EventEmitter
  once(eventName: "text-change", handler: TextChangeHandler): EventEmitter
  once(eventName: "selection-change", handler: SelectionChangeHandler): EventEmitter
  once(eventName: "editor-change", handler: EditorChangeHandler): EventEmitter
  off(eventName: "text-change", handler: TextChangeHandler): EventEmitter
  off(eventName: "selection-change", handler: SelectionChangeHandler): EventEmitter
  off(eventName: "editor-change", handler: EditorChangeHandler): EventEmitter
}

export type QuillEditor = EventEmitter & {
  root: HTMLDivElement | HTMLParagraphElement
  clipboard: ClipboardStatic
  container: HTMLElement
  syntax: {
    highlight(): void
  }
  history: {
    clear(): void
    undo(): void
    redo(): void
    cutoff(): void
    change(source: number | string, dest: number | string): void
    record(changeDelta: QuillDelta, oldDelta: QuillDelta): void
    transform(delta: QuillDelta): void
    lastRecorded: number
    ignoreChange: boolean
  }
  toolbar: {
    handlers: any[]
    controls: any[]
    container: any
    attach(input: any): void
    update(range: Range): void
    addHandler(type: string, handler: any): void
  }
  scroll: any
  keyboard: KeyboardStatic
  deleteText(index: number, length: number, source?: Sources): QuillDelta
  disable(): void
  enable(enabled?: boolean): void
  getContents(index?: number, length?: number): QuillDelta
  getLength(): number
  getText(index?: number, length?: number): string
  insertEmbed(index: number, type: string, value: any, source?: Sources): QuillDelta
  insertText(index: number, text: string, source?: Sources): QuillDelta
  insertText(index: number, text: string, format: string, value: any, source?: Sources): QuillDelta
  insertText(index: number, text: string, formats: StringMap, source?: Sources): QuillDelta
  /**
   * @deprecated Remove in 2.0. Use clipboard.dangerouslyPasteHTML(index: number, html: string, source: Sources)
   */
  pasteHTML(index: number, html: string, source?: Sources): string
  /**
   * @deprecated Remove in 2.0. Use clipboard.dangerouslyPasteHTML(html: string, source: Sources): void
   */
  pasteHTML(html: string, source?: Sources): string
  setContents(delta: QuillDelta, source?: Sources): QuillDelta
  setText(text: string, source?: Sources): QuillDelta
  update(source?: Sources): void
  updateContents(delta: QuillDelta, source?: Sources): QuillDelta

  format(name: string, value: any, source?: Sources): QuillDelta
  formatLine(index: number, length: number, source?: Sources): QuillDelta
  formatLine(index: number, length: number, format: string, value: any, source?: Sources): QuillDelta
  formatLine(index: number, length: number, formats: StringMap, source?: Sources): QuillDelta
  formatText(index: number, length: number, source?: Sources): QuillDelta
  formatText(index: number, length: number, format: string, value: any, source?: Sources): QuillDelta
  formatText(index: number, length: number, formats: StringMap, source?: Sources): QuillDelta
  formatText(range: RangeStatic, format: string, value: any, source?: Sources): QuillDelta
  formatText(range: RangeStatic, formats: StringMap, source?: Sources): QuillDelta
  getFormat(range?: RangeStatic): StringMap
  getFormat(index: number, length?: number): StringMap
  removeFormat(index: number, length: number, source?: Sources): QuillDelta

  blur(): void
  focus(): void
  getBounds(index: number, length?: number): BoundsStatic
  getSelection(focus: true): RangeStatic
  getSelection(focus?: false): RangeStatic | null
  hasFocus(): boolean
  setSelection(index: number, length: number, source?: Sources): void
  setSelection(range: RangeStatic, source?: Sources): void

  addContainer(classNameOrDomNode: string|Node, refNode?: Node): any
  getModule(name: string): any

  // Blot interface is not exported on Parchment
  getIndex(blot: any): number
  getLeaf(index: number): any
  getLine(index: number): [any, number]
  getLines(index?: number, length?: number): any[]
  getLines(range: RangeStatic): any[]
}
