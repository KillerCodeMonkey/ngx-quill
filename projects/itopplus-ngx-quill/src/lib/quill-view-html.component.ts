import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { QuillService } from './quill.service'

import {
  Component,
  Inject,
  Input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'quill-view-html',
  styles: [`
.ql-container.ngx-quill-view-html {
  border: 0;
}
`],
  template: `
  <div class="ql-container" [ngClass]="themeClass">
    <div class="ql-editor" [innerHTML]="innerHTML">
    </div>
  </div>
`,
  standalone: true,
  imports: [CommonModule]
})
export class QuillViewHTMLComponent implements OnChanges {
  @Input() content = ''
  @Input() theme?: string
  @Input() sanitize?: boolean

  innerHTML: SafeHtml = ''
  themeClass = 'ql-snow'

  constructor(
    @Inject(DomSanitizer) private sanitizer: DomSanitizer,
    protected service: QuillService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.theme) {
      const theme = changes.theme.currentValue || (this.service.config.theme ? this.service.config.theme : 'snow')
      this.themeClass = `ql-${theme} ngx-quill-view-html`
    } else if (!this.theme) {
      const theme = this.service.config.theme ? this.service.config.theme : 'snow'
      this.themeClass = `ql-${theme} ngx-quill-view-html`
    }
    if (changes.content) {
      const content = changes.content.currentValue
      const sanitize = [true, false].includes(this.sanitize) ? this.sanitize : (this.service.config.sanitize || false)

      this.innerHTML = sanitize ? content : this.sanitizer.bypassSecurityTrustHtml(content)
    }
  }
}
