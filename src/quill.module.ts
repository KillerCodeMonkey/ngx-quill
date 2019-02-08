import { ModuleWithProviders, NgModule } from '@angular/core'

import { defaultModules } from './quill-defaults'
import { QuillEditorComponent } from './quill-editor.component'
import { QUILL_CONFIG_TOKEN, QuillConfig } from './quill-editor.interfaces'

@NgModule({
  declarations: [
    QuillEditorComponent
  ],
  exports: [QuillEditorComponent],
  imports: [],
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
