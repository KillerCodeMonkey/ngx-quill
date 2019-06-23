import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

import { QUILL_CONFIG_TOKEN, QuillConfig } from './quill-editor.interfaces'

import {
  Component,
  Inject,
  Input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core'

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'quill-view-html',
  styles: ['.ngx-quill-view-html { border-width: 0 }'],
  template: `
  <div class="ql-container ngx-quill-view-html" [ngClass]="themeClass">
    <div class="ql-editor" [innerHTML]="innerHTML">
    </div>
  </div>
`
})
export class QuillViewHTMLComponent implements OnChanges {
  innerHTML: SafeHtml = ''
  themeClass: string = 'ql-snow'

  @Input() content: string = ''
  @Input() theme?: string

  constructor(
    private sanitizer: DomSanitizer,
    @Inject(QUILL_CONFIG_TOKEN) private config: QuillConfig
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.theme) {
      const theme = changes.theme.currentValue || (this.config.theme ? this.config.theme : 'snow')
      this.themeClass = `ql-${theme}`
    }
    if (changes.content) {
      this.innerHTML = this.sanitizer.bypassSecurityTrustHtml(changes.content.currentValue)
    }
  }
}
