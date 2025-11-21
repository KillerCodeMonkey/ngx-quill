import { getTestBed } from '@angular/core/testing'
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing'

import { afterEach, vi } from 'vitest'

afterEach(() => {
  vi.clearAllTimers()
})

getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting()
)
