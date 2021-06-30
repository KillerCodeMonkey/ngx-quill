import { Injectable, Inject } from '@angular/core'
import { QUILL_CONFIG_TOKEN, QuillConfig } from './quill-editor.interfaces'
import { defaultModules } from './quill-defaults'

@Injectable({
  providedIn: 'root'
})
export class QuillService {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private Quill!: any
  private $importPromise!: Promise<any>
  private count = 0

  constructor(
    @Inject(QUILL_CONFIG_TOKEN) public config: QuillConfig
  ) {
    if (!this.config) {
      this.config = { modules: defaultModules }
    }
  }

  getQuill() {
    this.count++
    if (!this.Quill && this.count === 1) {
      this.$importPromise = new Promise(async (resolve) => {
        // Quill adds events listeners on import https://github.com/quilljs/quill/blob/develop/core/emitter.js#L8
        // We'd want to use the unpatched `addEventListener` method to have all event callbacks to be run outside of zone.
        // We don't know yet if the `zone.js` is used or not, just save the value to restore it back further.
        const maybePatchedAddEventListener = document.addEventListener
        // There're 2 types of Angular applications:
        // 1) zone-full (by default)
        // 2) zone-less
        // The developer can avoid importing the `zone.js` package and tells Angular that he/she is responsible for running
        // the change detection by himself. This is done by "nooping" the zone through `CompilerOptions` when bootstrapping
        // the root module. We fallback to `document.addEventListener` if `__zone_symbol__addEventListener` is not defined,
        // this means the `zone.js` is not imported.
        // The `__zone_symbol__addEventListener` is basically a native DOM API, which is not patched by zone.js, thus not even going
        // through the `zone.js` task lifecycle. You can also access the native DOM API as follows `target[Zone.__symbol__('methodName')]`.
        // eslint-disable-next-line @typescript-eslint/dot-notation
        document.addEventListener = document['__zone_symbol__addEventListener'] || document.addEventListener
        const quillImport = await import('quill')
        document.addEventListener = maybePatchedAddEventListener

        this.Quill = (quillImport.default ? quillImport.default : quillImport) as any

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
