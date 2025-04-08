import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { QuillService } from './quill.service'

import {
  Component,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
  input,
  signal
} from '@angular/core'

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'quill-view-html',
  styles: [`
.ql-container.ngx-quill-view-html {
  border: 0;
}
`],
  template: `
  <div class="ql-container" [class]="themeClass()">
    <div class="ql-editor" [innerHTML]="innerHTML()">
    </div>
  </div>
`
})
export class QuillViewHTMLComponent implements OnChanges {
  readonly content = input('')
  readonly theme = input<string | undefined>(undefined)
  readonly sanitize = input<boolean | undefined>(undefined)

  readonly innerHTML = signal<SafeHtml>('')
  readonly themeClass = signal('ql-snow')

  constructor(
    private sanitizer: DomSanitizer,
    protected service: QuillService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.theme) {
      const theme = changes.theme.currentValue || (this.service.config.theme ? this.service.config.theme : 'snow')
      this.themeClass.set(`ql-${theme} ngx-quill-view-html`)
    } else if (!this.theme()) {
      const theme = this.service.config.theme ? this.service.config.theme : 'snow'
      this.themeClass.set(`ql-${theme} ngx-quill-view-html`)
    }
    if (changes.content) {
      const content = changes.content.currentValue
      const sanitize = [true, false].includes(this.sanitize()) ? this.sanitize() : (this.service.config.sanitize || false)
      const innerHTML = sanitize ? content : this.sanitizer.bypassSecurityTrustHtml(content)
      this.innerHTML.set(innerHTML)
    }
  }
}
