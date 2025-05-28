import { inject, Injectable } from '@angular/core'
import { defer, forkJoin, isObservable, Observable, of } from 'rxjs'
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

  private Quill!: any

  private quill$: Observable<any> = defer(async () => {
    if (!this.Quill) {
      // Quill adds event listeners on import:
      // https://github.com/quilljs/quill/blob/develop/core/emitter.js#L8
      // We want to use the unpatched `addEventListener` method to ensure all event
      // callbacks run outside of zone.
      // Since we don't yet know whether `zone.js` is used, we simply save the value
      // to restore it later.
      // We can use global `document` because we execute it only in the browser.
      const maybePatchedAddEventListener = document.addEventListener
      // There are two types of Angular applications:
      // 1) default (with zone.js)
      // 2) zoneless
      // Developers can avoid importing the `zone.js` package and inform Angular that
      // they are responsible for running change detection manually.
      // This can be done using `provideZonelessChangeDetection()`.
      // We fall back to `document.addEventListener` if `__zone_symbol__addEventListener`
      // is not defined, which indicates that `zone.js` is not imported.
      // The `__zone_symbol__addEventListener` is essentially the native DOM API,
      // unpatched by zone.js, meaning it does not go through the `zone.js` task lifecycle.
      document.addEventListener =
        document['__zone_symbol__addEventListener'] ||
        document.addEventListener
      const { Quill } = await import('./quill')
      document.addEventListener = maybePatchedAddEventListener
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

    // Use `Promise` directly to avoid bundling `firstValueFrom`.
    return new Promise(resolve => {
      this.registerCustomModules(
        this.Quill,
        this.config.customModules,
        this.config.suppressGlobalRegisterWarning
      ).subscribe(resolve)
    })
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
    const sources: (Observable<any> | Promise<any>)[] = [this.registerCustomModules(Quill, customModules)]
    if (beforeRender) {
      sources.push(beforeRender())
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
