import { DOCUMENT } from '@angular/common'
import { inject, Injectable } from '@angular/core'
import { defer, firstValueFrom, forkJoin, from, isObservable, Observable, of } from 'rxjs'
import { map, shareReplay, tap } from 'rxjs/operators'

import {
  CustomModule,
  defaultModules,
  QUILL_CONFIG_TOKEN,
  QuillConfig
} from 'ngx-quill/config'

@Injectable({
  providedIn: 'root',
})
export class QuillService {
  readonly config = inject(QUILL_CONFIG_TOKEN) || { modules:defaultModules } as QuillConfig

  private document = inject(DOCUMENT)

  private Quill!: any

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
        this.document['__zone_symbol__addEventListener'] ||
        this.document.addEventListener
      const { Quill } = await import('./quill')
      this.document.addEventListener = maybePatchedAddEventListener
      this.Quill = Quill
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

    return firstValueFrom(this.registerCustomModules(
      this.Quill,
      this.config.customModules,
      this.config.suppressGlobalRegisterWarning
    ))
  }).pipe(
    shareReplay({
      bufferSize: 1,
      refCount: false
    })
  )

  // A list of custom modules that have already been registered,
  // so we don’t need to await their implementation.
  private registeredModules = new Set<string>()

  getQuill() {
    return this.quill$
  }

  /** @internal */
  beforeRender(Quill: any, customModules: CustomModule[] | undefined, beforeRender = this.config.beforeRender) {
    // This function is called each time the editor needs to be rendered,
    // so it operates individually per component. If no custom module needs to be
    // registered and no `beforeRender` function is provided, it will emit
    // immediately and proceed with the rendering.
    const sources = [this.registerCustomModules(Quill, customModules)]
    if (beforeRender) {
      sources.push(from(beforeRender()))
    }
    return forkJoin(sources).pipe(map(() => Quill))
  }

  /** @internal */
  private registerCustomModules(
    Quill: any,
    customModules: CustomModule[] | undefined,
    suppressGlobalRegisterWarning?: boolean
  ) {
    if (!Array.isArray(customModules)) {
      return of(Quill)
    }

    const sources: Observable<unknown>[] = []

    for (const customModule of customModules) {
      const { path, implementation: maybeImplementation } = customModule

      // If the module is already registered, proceed to the next module...
      if (this.registeredModules.has(path)) {
        continue
      }

      this.registeredModules.add(path)

      if (isObservable(maybeImplementation)) {
        // If the implementation is an observable, we will wait for it to load and
        // then register it with Quill. The caller will wait until the module is registered.
        sources.push(maybeImplementation.pipe(
          tap((implementation) => {
            Quill.register(path, implementation, suppressGlobalRegisterWarning)
          })
        ))
      } else {
        Quill.register(path, maybeImplementation, suppressGlobalRegisterWarning)
      }
    }

    return sources.length > 0 ? forkJoin(sources).pipe(map(() => Quill)) : of(Quill)
  }
}
