import { QuillConfig } from './quill-editor.interfaces';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { QuillEditorComponent } from './quill-editor.component';

@NgModule({
  declarations: [
    QuillEditorComponent
  ],
  imports: [],
  exports: [QuillEditorComponent],
  providers: [
    {
      provide: 'config',
      useValue: undefined,
    }
  ]
})
export class QuillModule {
  static forRoot(config: QuillConfig): ModuleWithProviders {
    return {
      ngModule: QuillModule,
      providers: [
        {
          provide: 'config',
          useValue: config,
        }
      ]
    };
  }
}
