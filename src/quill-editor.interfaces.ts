import { InjectionToken } from '@angular/core'

export type QuillToolbarConfig = Array<Array<
  string | {
    indent?: string
    list?: string
    direction?: string
    header?: number | Array<boolean | number>
    color?: string[]
    background?: string[]
    align?: string[]
    script?: string
    font?: string[]
    size?: Array<boolean | string>
  }
>>

export interface QuillModules {
  [key: string]: any
  clipboard?: {
    mathers?: any[]
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
  toolbar: QuillToolbarConfig | string | {
    container?: string | QuillToolbarConfig
    handlers?: {
      [key: string]: any
    }
  }
}

export interface QuillConfig {
  bounds?: HTMLElement | string
  debug?: 'error' | 'warn' | 'log' | false
  formats?: any
  modules?: QuillModules
  placeholder?: string
  readOnly?: boolean
  scrollingContainer?: HTMLElement | string | null
  theme?: string
  // Custom Config to track all changes or only changes by 'user'
  trackChanges?: 'user' | 'all'
}

export const QUILL_CONFIG_TOKEN = new InjectionToken<QuillConfig>('config')
