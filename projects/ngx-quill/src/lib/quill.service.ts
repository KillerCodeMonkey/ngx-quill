import { DOCUMENT } from '@angular/common'
import { Injectable, Inject, Injector, Optional } from '@angular/core'
import { defer, firstValueFrom, isObservable, Observable } from 'rxjs'
import { shareReplay } from 'rxjs/operators'

import {
  defaultModules,
  QUILL_CONFIG_TOKEN,
  QuillConfig,
  CustomModule,
} from 'ngx-quill/config'

@Injectable({
  providedIn: 'root',
})
export class QuillService {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private Quill!: any
  private document: Document
  private quill$: Observable<any> = defer(async () => {
    if (!this.Quill) {
      // Quill adds events listeners on import https://github.com/quilljs/quill/blob/develop/core/emitter.js#L8
      // We'd want to use the unpatched `addEventListener` method to have all event callbacks to be run outside of zone.
      // We don't know yet if the `zone.js` is used or not, just save the value to restore it back further.
      const maybePatchedAddEventListener = this.document.addEventListener
      // There're 2 types of Angular applications:
      // 1) zone-full (by default)
      // 2) zone-less
      // The developer can avoid importing the `zone.js` package and tells Angular that he/she is responsible for running
      // the change detection by himself. This is done by "nooping" the zone through `CompilerOptions` when bootstrapping
      // the root module. We fallback to `document.addEventListener` if `__zone_symbol__addEventListener` is not defined,
      // this means the `zone.js` is not imported.
      // The `__zone_symbol__addEventListener` is basically a native DOM API, which is not patched by zone.js, thus not even going
      // through the `zone.js` task lifecycle. You can also access the native DOM API as follows `target[Zone.__symbol__('methodName')]`.
      this.document.addEventListener =
        // eslint-disable-next-line @typescript-eslint/dot-notation
        this.document['__zone_symbol__addEventListener'] ||
        this.document.addEventListener
      const quillImport = await import(/* webpackChunkName: 'quill' */ 'quill')
      this.document.addEventListener = maybePatchedAddEventListener

      this.Quill = (
        quillImport.default ? quillImport.default : quillImport
      ) as any
    }

    // Only register custom options and modules once
    this.config.customOptions?.forEach((customOption) => {
      const newCustomOption = this.Quill.import(customOption.import)
      newCustomOption.whitelist = customOption.whitelist
      this.Quill.register(
        newCustomOption,
        true,
        this.config.suppressGlobalRegisterWarning
      )
    })

    return await this.registerCustomModules(
      this.Quill,
      this.config.customModules,
      this.config.suppressGlobalRegisterWarning
    )
  }).pipe(shareReplay({ bufferSize: 1, refCount: true }))

  constructor(
    injector: Injector,
    @Optional() @Inject(QUILL_CONFIG_TOKEN) public config: QuillConfig
  ) {
    this.document = injector.get(DOCUMENT)

    if (!this.config) {
      this.config = { modules: defaultModules }
    }
  }

  getQuill() {
    return this.quill$
  }

  /**
   * Marked as internal so it won't be available for `ngx-quill` consumers, this is only
   * internal method to be used within the library.
   *
   * @internal
   */
  async registerCustomModules(
    Quill: any,
    customModules: CustomModule[] | undefined,
    suppressGlobalRegisterWarning?: boolean
  ): Promise<any> {
    if (Array.isArray(customModules)) {
      // eslint-disable-next-line prefer-const
      for (let { implementation, path } of customModules) {
        // The `implementation` might be an observable that resolves the actual implementation,
        // e.g. if it should be lazy loaded.
        if (isObservable(implementation)) {
          implementation = await firstValueFrom(implementation)
        }
        Quill.register(path, implementation, suppressGlobalRegisterWarning)
      }
    }

    // Return `Quill` constructor so we'll be able to re-use its return value except of using
    // `map` operators, etc.
    return Quill
  }
}
