// This file is required by karma.conf.js and loads recursively all the .spec and framework files
import { getTestBed } from '@angular/core/testing'
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing'
import 'zone.js'
import 'zone.js/testing'
// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting()
)

