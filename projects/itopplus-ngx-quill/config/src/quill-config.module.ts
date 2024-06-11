import { ModuleWithProviders, NgModule } from '@angular/core'

import { QuillConfig, QUILL_CONFIG_TOKEN } from './quill-editor.interfaces'

/**
 * This `NgModule` provides a global Quill config on the root level, e.g., in `AppModule`.
 * But this eliminates the need to import the entire `ngx-quill` library into the main bundle.
 * The `quill-editor` itself may be rendered in any lazy-loaded module, but importing `QuillModule`
 * into the `AppModule` will bundle the `ngx-quill` into the vendor.
 */
@NgModule()
export class QuillConfigModule {
  static forRoot(config: QuillConfig): ModuleWithProviders<QuillConfigModule> {
    return {
      ngModule: QuillConfigModule,
      providers: [{ provide: QUILL_CONFIG_TOKEN, useValue: config }],
    }
  }
}
