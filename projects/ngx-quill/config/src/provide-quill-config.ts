import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core'

import { QUILL_CONFIG_TOKEN, QuillConfig } from './quill-editor.interfaces'

/**
 * Provides Quill configuration at the root level:
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [provideQuillConfig(...)]
 * });
 * ```
 */
export const provideQuillConfig = (config: QuillConfig): EnvironmentProviders =>
  makeEnvironmentProviders([{ provide: QUILL_CONFIG_TOKEN, useValue: config }])
