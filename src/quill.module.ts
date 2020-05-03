import { CommonModule } from '@angular/common'
import { ModuleWithProviders, NgModule } from '@angular/core'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Quill = require('quill')

import { defaultModules } from './quill-defaults'
import { QuillEditorComponent } from './quill-editor.component'
import { QUILL_CONFIG_TOKEN, QuillConfig } from './quill-editor.interfaces'
import { QuillViewHTMLComponent } from './quill-view-html.component'
import { QuillViewComponent } from './quill-view.component'

@NgModule({
  declarations: [
    QuillEditorComponent,
    QuillViewComponent,
    QuillViewHTMLComponent
  ],
  exports: [QuillEditorComponent, QuillViewComponent, QuillViewHTMLComponent],
  imports: [CommonModule],
  providers: []
})
export class QuillModule {
  static forRoot(config?: QuillConfig): ModuleWithProviders {
    if (config) {
      // Only register custom options and modules once
      config.customOptions?.forEach((customOption) => {
        const newCustomOption = Quill.import(customOption.import)
        newCustomOption.whitelist = customOption.whitelist
        Quill.register(newCustomOption, true)
      })

      config.customModules?.forEach(({implementation, path}) => {
        Quill.register(path, implementation)
      })

      // set default modules as modules if not modules key passed on custom config
      if (!config.modules) {
        config.modules = defaultModules
      }
    }

    return {
      ngModule: QuillModule,
      providers: [
        {
          provide: QUILL_CONFIG_TOKEN,
          useValue: config || { modules: defaultModules }
        }
      ]
    }
  }
}
