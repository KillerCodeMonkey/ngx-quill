import { QuillFormat } from 'ngx-quill/config'
import { Observable } from 'rxjs'

export const getFormat = (format?: QuillFormat, configFormat?: QuillFormat): QuillFormat => {
  const passedFormat = format || configFormat
  return passedFormat || 'html'
}

export const raf$ = () => {
  return new Observable<void>(subscriber => {
    const rafId = requestAnimationFrame(() => {
      subscriber.next()
      subscriber.complete()
    })

    return () => cancelAnimationFrame(rafId)
  })
}
