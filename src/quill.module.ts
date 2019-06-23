import { CommonModule } from '@angular/common'
import { ModuleWithProviders, NgModule } from '@angular/core'

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
  providers: [
    {
      provide: QUILL_CONFIG_TOKEN,
      useValue: { modules: defaultModules }
    }
  ]
})
export class QuillModule {
  static forRoot(config?: QuillConfig): ModuleWithProviders {
    return {
      ngModule: QuillModule,
      providers: [
        {
          provide: QUILL_CONFIG_TOKEN,
          // tslint:disable-next-line:only-arrow-functions
          useValue: config || { modules: defaultModules }
        }
      ]
    }
  }
}
