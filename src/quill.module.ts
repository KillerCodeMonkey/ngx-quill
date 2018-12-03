import { ModuleWithProviders, NgModule } from '@angular/core'

import { QuillEditorComponent } from './quill-editor.component'
import { QuillConfig } from './quill-editor.interfaces'

const emptyArray: any[] = []
const defaultModules = {
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
      { color: emptyArray.slice() },
      { background: emptyArray.slice() }
    ], // dropdown with defaults from theme
    [{ font: emptyArray.slice() }],
    [{ align: emptyArray.slice() }],

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
      provide: 'config',
      useValue: defaultModules
    }
  ]
})
export class QuillModule {
  static forRoot(config?: QuillConfig): ModuleWithProviders {
    return {
      ngModule: QuillModule,
      providers: [
        {
          provide: 'config',
          useValue: config || defaultModules
        }
      ]
    }
  }
}
