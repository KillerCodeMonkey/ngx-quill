import '@analogjs/vitest-angular/setup-zone'

import { getTestBed } from '@angular/core/testing'
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing'

import { afterEach, vi } from 'vitest'

afterEach(() => {
  vi.clearAllTimers()
})

// globalThis.requestAnimationFrame = (cb) => {
//   cb(0)
//   return 0
// }

// globalThis.window.requestAnimationFrame = (cb) => {
//   cb(0)
//   return 0
// }

getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting()
)
