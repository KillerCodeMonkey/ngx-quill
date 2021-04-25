import {QuillFormat} from './quill-editor.interfaces'

export const getFormat = (format?: QuillFormat, configFormat?: QuillFormat): QuillFormat => {
  const passedFormat = format || configFormat
  return passedFormat || 'html'
}

export const debounce = <T extends (...args: any[]) => any>(callback: T, debounceTime: number): T => {
  let timer: ReturnType<typeof setTimeout>;

  return function (...args: any[]) {
    if (typeof debounceTime !== 'number') {
      callback.apply(this, args)
      return
    }

    clearTimeout(timer);

    timer = setTimeout(() => {
      callback.apply(this, args)
    }, debounceTime)
  } as T
}
