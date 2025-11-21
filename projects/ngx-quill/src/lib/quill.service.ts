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
      const { Quill } = await import('./quill')
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
