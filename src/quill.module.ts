import { Config } from './quill-editor.interfaces';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { QuillEditorComponent } from './quill-editor.component';

@NgModule({
  declarations: [
    QuillEditorComponent
  ],
  imports: [],
  exports: [QuillEditorComponent],
  providers: []
})
export class QuillModule {
  static forRoot(config: Config): ModuleWithProviders {
    return {
      ngModule: QuillModule,
      providers: [
        {
          provide: 'config',
          useValue: config,
        }
      ]
    }
  }
}
