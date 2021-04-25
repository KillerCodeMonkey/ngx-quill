import {QuillFormat} from './quill-editor.interfaces'

export const getFormat = (format?: QuillFormat, configFormat?: QuillFormat): QuillFormat => {
  const passedFormat = format || configFormat
  return passedFormat || 'html'
}

export const debounce = (callback: Function, debounceTime: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return function (...args: any[]) {
    if (typeof debounceTime !== 'number') {
      return callback.apply(this, args)
    }

    clearTimeout(timer);

    timer = setTimeout(() => {
      callback.apply(this, args)
    }, debounceTime)
  }
}
