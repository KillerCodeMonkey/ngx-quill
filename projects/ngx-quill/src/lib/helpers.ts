import {QuillFormat} from './quill-editor.interfaces'

export const getFormat = (format?: QuillFormat, configFormat?: QuillFormat): QuillFormat => {
  const passedFormat = format || configFormat
  return passedFormat || 'html'
}

export const debounce = <T extends (...args: any[]) => any>(
  callback: T,
  debounceTime?: number
): ((...args: Parameters<T>) => void) => {
  let timer: number

  return function(...args: Parameters<T>) {
    if (typeof debounceTime !== 'number') {
      callback.apply(this, args)
      return
    }

    clearTimeout(timer)

    timer = setTimeout(() => {
      callback.apply(this, args)
    }, debounceTime)
  }
}
