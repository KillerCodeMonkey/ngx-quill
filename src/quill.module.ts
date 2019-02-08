import { ModuleWithProviders, NgModule } from '@angular/core'

import { QuillEditorComponent } from './quill-editor.component'
import { QUILL_CONFIG_TOKEN, QuillConfig } from './quill-editor.interfaces'

export const defaultModules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ direction: 'rtl' }], // text direction

    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [
      { color: [] },
      { background: [] }
    ], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ['clean'], // remove formatting button

    ['link', 'image', 'video'] // link and image, video
  ]
}

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
          useValue: Object.assign({}, {...config}, {
            modules: defaultModules
          })
        }
      ]
    }
  }
}
