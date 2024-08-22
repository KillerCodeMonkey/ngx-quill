/* eslint-disable @typescript-eslint/no-explicit-any */
import { InjectionToken } from '@angular/core'

import { defaultModules } from './quill-defaults'
import type { QuillOptions } from 'quill'

export interface CustomOption {
  import: string
  whitelist: any[]
}

export interface CustomModule {
  // The `implementation` may be a custom module constructor or an Observable that resolves to
  // a custom module constructor (in case you'd want to load your custom module lazily).
  // For instance, these options are applicable:
  // import BlotFormatter from 'quill-blot-formatter';
  // customModules = [
  //   { path: 'modules/blotFormatter', implementation: BlotFormatter }
  // ];
  // Or:
  // const BlotFormatter$ = defer(() => import('quill-blot-formatter').then(m => m.default))
  // customModules = [
  //   { path: 'modules/blotFormatter', implementation: BlotFormatter$ }
  // ];
  implementation: any
  path: string
}

export type QuillToolbarConfig = Array<Array< string | {
  [index: string]: string | number | boolean | Array<boolean | string | number>
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
  } | boolean
  history?: {
    delay?: number
    maxStack?: number
    userOnly?: boolean
  } | boolean
  keyboard?: {
    bindings?: any
  } | boolean
  syntax?: boolean | { hljs: any }
  table?: boolean | Record<string, unknown>
  toolbar?: QuillToolbarConfig | string | {
    container?: string | string[] | QuillToolbarConfig
    handlers?: {
      [key: string]: any
    }
  } | boolean
}

export type QuillFormat = 'object' | 'json' | 'html' | 'text'

export interface QuillConfig {
  bounds?: HTMLElement | string
  customModules?: CustomModule[]
  customOptions?: CustomOption[]
  suppressGlobalRegisterWarning?: boolean
  debug?: 'error' | 'warn' | 'log' | false
  format?: QuillFormat
  formats?: string[]
  modules?: QuillModules
  placeholder?: string
  readOnly?: boolean
  registry?: QuillOptions['registry'] // added in quill2 result of const registry = new Parchment.Registry();
  theme?: string
  // Custom Config to track all changes or only changes by 'user'
  trackChanges?: 'user' | 'all'
  // provide default empty value
  defaultEmptyValue?: any
  sanitize?: boolean
  // A function, which is executed before the Quill editor is rendered, this might be useful
  // for lazy-loading CSS.
  beforeRender?: () => Promise<any>
}

export const QUILL_CONFIG_TOKEN = new InjectionToken<QuillConfig>('config', {
  providedIn: 'root',
  factory: () => ({ modules: defaultModules })
})
