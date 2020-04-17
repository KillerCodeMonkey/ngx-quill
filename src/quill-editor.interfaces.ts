import { InjectionToken } from '@angular/core'
import { Quill as QuillEditor, QuillDelta } from './quill'

export type QuillToolbarConfig = Array<Array< string | {
  indent?: string
  list?: string
  direction?: string
  header?: number | Array<boolean | number>
  color?: string[] | string
  background?: string[] | string
  align?: string[] | string
  script?: string
  font?: string[] | string
  size?: Array<boolean | string>
}
>>

export interface QuillModules {
  [key: string]: any
  clipboard?: {
    matchers?: any[]
    matchVisual?: boolean
  } | boolean
  history?: {
    delay?: number
    maxStack?: number
    userOnly?: boolean
  } | boolean
  keyboard?: {
    bindings?: any
  } | boolean
  syntax?: boolean
  toolbar?: QuillToolbarConfig | string | {
    container?: string | string[] | QuillToolbarConfig
    handlers?: {
      [key: string]: any
    }
  } | boolean
}

export type QuillFormat = 'object' | 'json' | 'html' | 'text'

export interface QuillConfig {
  bounds?: HTMLElement | string
  debug?: 'error' | 'warn' | 'log' | false
  format?: QuillFormat
  formats?: string[]
  modules?: QuillModules
  placeholder?: string
  readOnly?: boolean
  scrollingContainer?: HTMLElement | string | null
  theme?: string
  // Custom Config to track all changes or only changes by 'user'
  trackChanges?: 'user' | 'all'
}

export type Quill = QuillEditor
export type Delta = QuillDelta

export const QUILL_CONFIG_TOKEN = new InjectionToken<QuillConfig>('config')
