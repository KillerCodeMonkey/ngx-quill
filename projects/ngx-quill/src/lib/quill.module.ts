import { ModuleWithProviders, NgModule } from '@angular/core'

import { QUILL_CONFIG_TOKEN, QuillConfig } from 'ngx-quill/config'

import { QuillEditorComponent } from './quill-editor.component'
import { QuillViewHTMLComponent } from './quill-view-html.component'
import { QuillViewComponent } from './quill-view.component'

@NgModule({
  imports: [QuillEditorComponent, QuillViewComponent, QuillViewHTMLComponent],
  exports: [QuillEditorComponent, QuillViewComponent, QuillViewHTMLComponent],
})
export class QuillModule {
  static forRoot(config?: QuillConfig): ModuleWithProviders<QuillModule> {
    return {
      ngModule: QuillModule,
      providers: [
        {
          provide: QUILL_CONFIG_TOKEN,
          useValue: config
        }
      ]
    }
  }
}
