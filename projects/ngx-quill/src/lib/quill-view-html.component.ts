import { DomSanitizer } from '@angular/platform-browser'
import { QuillService } from './quill.service'

import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
  input
} from '@angular/core'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  readonly innerHTML = computed(() => {
    const sanitize = this.sanitize()
    const content = this.content()
    return ([true, false].includes(sanitize) ? sanitize : (this.service.config.sanitize || false)) ? content : this.sanitizer.bypassSecurityTrustHtml(content)
  })
  readonly themeClass = computed(() => {
    const base = this.service.config.theme ? this.service.config.theme : 'snow'
    return `ql-${this.theme() || base} ngx-quill-view-html`
  })

  private sanitizer = inject(DomSanitizer)
  private service = inject(QuillService)
}
