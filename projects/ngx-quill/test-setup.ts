import '@analogjs/vitest-angular/setup-zone'
import { getTestBed } from '@angular/core/testing'
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing'
console.log('test-setup')

import { afterEach, vi } from 'vitest'

afterEach(() => {
  vi.clearAllTimers()
})

global.requestAnimationFrame = (cb) => {
  cb(0)
  return 0
}

global.window.requestAnimationFrame = (cb) => {
  cb(0)
  return 0
}

getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting()
)
