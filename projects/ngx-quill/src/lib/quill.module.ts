import { CommonModule } from '@angular/common'
import { ModuleWithProviders, NgModule } from '@angular/core'

import { defaultModules } from './quill-defaults'
import { QuillEditorComponent } from './quill-editor.component'
import { QUILL_CONFIG_TOKEN, QuillConfig } from './quill-editor.interfaces'
import { QuillViewHTMLComponent } from './quill-view-html.component'
import { QuillViewComponent } from './quill-view.component'
import { QuillService } from './quill.service'

@NgModule({
  declarations: [
    QuillEditorComponent,
    QuillViewComponent,
    QuillViewHTMLComponent
  ],
  exports: [QuillEditorComponent, QuillViewComponent, QuillViewHTMLComponent],
  imports: [CommonModule],
  providers: [QuillService]
})
export class QuillModule {
  static forRoot(config?: QuillConfig): ModuleWithProviders<QuillModule> {
    if (config) {
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
