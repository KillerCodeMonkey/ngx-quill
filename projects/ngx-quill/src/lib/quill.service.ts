import { Injectable, Inject } from '@angular/core'
import { QUILL_CONFIG_TOKEN, QuillConfig } from './quill-editor.interfaces'
import { defaultModules } from './quill-defaults'

@Injectable({
  providedIn: 'root'
})
export class QuillService {
  private Quill!: any
  private $importPromise!: Promise<any>
  private count = 0

  constructor(
    @Inject(QUILL_CONFIG_TOKEN) public config: QuillConfig
  ) {}

  getQuill() {
    this.count++
    if (!this.Quill && this.count === 1) {
      this.$importPromise = new Promise(async (resolve) => {
        const quillImport = await import('quill')

        this.Quill = (quillImport.default ? quillImport.default : quillImport) as any

        if (!this.config) {
          this.config = { modules: defaultModules }
        }

        // Only register custom options and modules once
        this.config.customOptions?.forEach((customOption) => {
          const newCustomOption = this.Quill.import(customOption.import)
          newCustomOption.whitelist = customOption.whitelist
          this.Quill.register(newCustomOption, true, this.config.suppressGlobalRegisterWarning)
        })

        this.config.customModules?.forEach(({implementation, path}) => {
          this.Quill.register(path, implementation, this.config.suppressGlobalRegisterWarning)
        })

        resolve(this.Quill)
      })
    }
    return this.$importPromise
  }
}
