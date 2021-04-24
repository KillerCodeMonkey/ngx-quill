import {QuillFormat} from './quill-editor.interfaces'

export const getFormat = (format?: QuillFormat, configFormat?: QuillFormat): QuillFormat => {
  const passedFormat = format || configFormat
  return passedFormat || 'html'
}

export const debounce = (callback: Function, debounceTime = 0) => {
  let timer: ReturnType<typeof setTimeout>;
  return function (...args: any[]) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      callback.apply(this, args)
    }, debounceTime)
  }
}
