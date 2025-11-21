import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { QuillService } from './quill.service'

import {
  Component,
  ViewEncapsulation,
  effect,
  inject,
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
export class QuillViewHTMLComponent {
  readonly content = input('')
  readonly theme = input<string | undefined>(undefined)
  readonly sanitize = input<boolean | undefined>(undefined)

  readonly innerHTML = signal<SafeHtml>('')
  readonly themeClass = signal('ql-snow')

  private sanitizer = inject(DomSanitizer)
  private service = inject(QuillService)

  constructor() {
    effect(() => {
      if (this.theme()) {
        const theme = this.theme() || (this.service.config.theme ? this.service.config.theme : 'snow')
        this.themeClass.set(`ql-${theme} ngx-quill-view-html`)
      } else if (!this.theme()) {
        const theme = this.service.config.theme ? this.service.config.theme : 'snow'
        this.themeClass.set(`ql-${theme} ngx-quill-view-html`)
      }
      if (this.content()) {
        const content = this.content()
        const sanitize = [true, false].includes(this.sanitize()) ? this.sanitize() : (this.service.config.sanitize || false)
        const innerHTML = sanitize ? content : this.sanitizer.bypassSecurityTrustHtml(content)
        this.innerHTML.set(innerHTML)
      }
    })
  }
}
