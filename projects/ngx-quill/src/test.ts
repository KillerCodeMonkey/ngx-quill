// This file is required by karma.conf.js and loads recursively all the .spec and framework files
import 'zone.js'
import 'zone.js/testing'
import { getTestBed } from '@angular/core/testing'
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    <T>(id: string): T
    keys(): string[]
  }
}

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
)
