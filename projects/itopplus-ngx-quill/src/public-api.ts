/*
 * Public API Surface of ngx-quill
 */

// Re-export everything from the secondary entry-point so we can be backwards-compatible
// and don't introduce breaking changes for consumers.
export * from 'itopplus-ngx-quill/config'

export * from './lib/quill.module'
export * from './lib/quill.service'
export * from './lib/quill-editor.component'
export * from './lib/quill-view.component'
export * from './lib/quill-view-html.component'
