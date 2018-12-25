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
  syntax?: boolean
  toolbar: QuillToolbarConfig
}

export interface QuillConfig {
  modules?: QuillModules
}

export const QUILL_CONFIG_TOKEN = new InjectionToken<QuillConfig>('config')
