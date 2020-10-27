import { Injectable, Inject } from '@angular/core'
import { QUILL_CONFIG_TOKEN, QuillConfig } from './quill-editor.interfaces'
import { defaultModules } from './quill-defaults'
const Quill = require('quill')

@Injectable({
  providedIn: 'root'
})
export class QuillService {

  constructor(
    @Inject(QUILL_CONFIG_TOKEN) public config: QuillConfig
  ) {
    if (!this.config) {
      this.config = { modules: defaultModules }
    }
  }

  getQuill() {
    // Only register custom options and modules once
    this.config.customOptions?.forEach((customOption) => {
      const newCustomOption = Quill.import(customOption.import)
      newCustomOption.whitelist = customOption.whitelist
      Quill.register(newCustomOption, true, this.config.suppressGlobalRegisterWarning)
    })

    this.config.customModules?.forEach(({implementation, path}) => {
      Quill.register(path, implementation, this.config.suppressGlobalRegisterWarning)
    })

    return Quill
  }
}
